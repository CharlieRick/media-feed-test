export interface ApiResponse<T = Record<string, unknown>> {
  data: T;
  errors?: Record<string, string[]>;
  headers?: Headers;
  message?: string;
  meta: {
    page: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  status?: number;
  url?: string;
  ok?: boolean;
  blob?: () => Promise<Blob>;
}