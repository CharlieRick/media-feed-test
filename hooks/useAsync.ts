'use client';
import React, { useCallback, useReducer, useRef, useState } from 'react';
import { ApiResponse } from '../interfaces';

type AsyncStatus = 'idle' | 'pending' | 'rejected' | 'resolved';

interface AsyncState<Data> {
    status: AsyncStatus;
    data: Data | null;
    error: any;
}

function useSafeDispatch<Data>(
    dispatch: React.Dispatch<Partial<AsyncState<Data>>>
): React.Dispatch<Partial<AsyncState<Data>>> {
    const mounted = useRef(false);
    React.useLayoutEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    return React.useCallback(
        (...args: Partial<AsyncState<Data>>[]) =>
            mounted.current ? dispatch(Object.assign({}, ...args)) : undefined,
        [dispatch]
    );
}

function useAsync<Data>(initialState?: Partial<AsyncState<Data>> & { status?: AsyncStatus; appendMode?: boolean; }): {
    isIdle: boolean;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    setData: (data: Data | null) => void;
    setError: (error: { status: number; message: string }) => void;
    error: {
        status: number;
        message: string;
    };
    status: AsyncStatus;
    data: Data | null;
    run: (promise: Promise<ApiResponse<Data> | null>) => Promise<ApiResponse<Data> | null>;
    reset: () => void;
    currentPage: number;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
} {
    const initialAppendMode = initialState?.appendMode || false;

    const initialStateRef = useRef<AsyncState<Data>>({
        status: initialState?.status || 'idle',
        data: initialState?.data || null,
        error: initialState?.error || null,
    });

    const [{ status, data, error }, setState] = useReducer(
        (s: AsyncState<Data>, a: Partial<AsyncState<Data>>): AsyncState<Data> => ({ ...s, ...a }),
        initialStateRef.current
    );

    const safeSetState = useSafeDispatch(setState);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const setData = useCallback(
        (data: Data | null) => safeSetState({ data, status: 'resolved', error: null }),
        [safeSetState]
    );
    const setError = useCallback(
        (error: any) => safeSetState({ error, status: 'rejected', data: null }),
        [safeSetState]
    );
    const reset = useCallback(() => safeSetState(initialStateRef.current), [safeSetState]);

    const run = useCallback(
        async (promise: Promise<ApiResponse<Data> | null>): Promise<ApiResponse<Data> | null> => {
            if (!promise || !promise.then) {
                throw new Error(
                    "The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"
                );
            }

            safeSetState({ status: 'pending' });
            return promise.then(
                (response) => {
                    // Append if mode enabled and prev data exists
                    if (initialAppendMode && response?.data && data) {
                        const newData = Array.isArray(data) && Array.isArray(response.data)
                            ? [...data, ...response.data] as Data
                            : response.data;
                        setData(newData);
                    } else {
                        setData(response?.data ?? null);
                    }
                    setTotalPages(response?.meta?.page.last_page || 1);
                    safeSetState({ status: 'resolved' });
                    return response;
                },
                async (error) => {
                    setError(error);
                    return Promise.reject(error);
                }
            );
        },
        [safeSetState, setData, setError]
    );

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    const goToPage = (page: number) => setCurrentPage(page);

    return {
        isIdle: status === 'idle',
        isLoading: status === 'pending',
        isError: status === 'rejected',
        isSuccess: status === 'resolved',
        setData,
        setError,
        error,
        status,
        data,
        run,
        reset,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
    };
}

export default useAsync;
