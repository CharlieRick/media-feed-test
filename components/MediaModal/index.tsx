'use client';

import Image from 'next/image';

import { IoCloseSharp } from "react-icons/io5";

import type { MediaItem } from '@/interfaces';

interface MediaModalProps {
  item: MediaItem;
  onClose: () => void;
}

export default function MediaModal({ item, onClose }: MediaModalProps) {
  const isVideo = item.type === 'video';
  const fullSrc = isVideo
    ? item.video_files.find(f => f.quality === 'hd')?.link || item.video_files[0].link
    : item.src.original;

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>): void {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      open
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 max-w-none max-h-none w-screen h-screen bg-black/90 backdrop:bg-black/80 open:flex open:items-center open:justify-center"
    >
      <div className="relative max-w-5xl w-full max-h-[calc(100vh-90px)] p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 -right-12 z-10 rounded-full cursor-pointer bg-white/10 p-2 hover:bg-white/20 transition"
        >
          <IoCloseSharp className="w-8 h-8 text-white" />
        </button>

        {/* Content */}
        {isVideo ? (
          <video
            src={fullSrc}
            controls
            autoPlay
            playsInline
            className="w-full h-full max-h-[calc(100vh-180px)] object-contain rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={fullSrc}
            alt={item.alt || 'Full size image'}
            width={item.width}
            height={item.height}
            className="max-w-full max-h-[calc(100vh-180px)] object-contain rounded-lg"
            priority
          />
        )}
      </div>
    </dialog>
  );
}