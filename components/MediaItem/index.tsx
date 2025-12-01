'use client';

import { Fragment, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { IoCameraOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { IoPlayOutline } from "react-icons/io5";

import type { MediaItem } from '@/interfaces';
import { tw } from '@/utils';
import MediaModal from '../MediaModal';

export default function MediaItem({ item }: { item: MediaItem }) {
  const isVideo = item.type === 'video';
  const thumb = isVideo ? item.image : item.src.large2x;
  const author = isVideo ? { name: item.user.name, url: item.user.url } : { name: item.photographer, url: item.photographer_url }

  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLike = () => setIsLiked(prev => !prev);

  const handleMouseEnter = () => {
    if (item.type !== 'video') return;

    const videoUrl = item.video_files.find(f => f.quality === 'hd')?.link || item.video_files[0].link

    if (isVideo && videoUrl) {
      // Preload the video blob in memory
      fetch(videoUrl).then(r => r.blob());
    }
  };

  return (
    <Fragment>

      <div className="pb-8 pt-12 not-last:border-b border-white/30">
        <Link href={author.url} target='_blank' className="flex gap-4 items-center mb-8 text-xl font-medium">
          <div className="h-12 w-12 rounded-full border-white border flex items-center justify-center">
            {isVideo ? <IoVideocamOutline /> : <IoCameraOutline />}
          </div>
          {author.name}
        </Link>

        {!isVideo ? (
          <p className="font-bold mb-8">
            {item.alt}
          </p>
        ) : null}

        <div
          className="relative group cursor-pointer max-h-[600px] overflow-hidden rounded-lg"
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={handleMouseEnter}
        >
          <Image
            src={thumb}
            alt={author.name || 'Media'}
            width={400} height={400}
            className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {isVideo && <IoPlayOutline className="absolute inset-0 m-auto group-hover:scale-150 duration-500 transition w-24 h-24 text-white opacity-80" />}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={toggleLike}>
            <IoHeart stroke='1px' size={36} className={tw('cursor-pointer fill-none stroke-15 stroke-white hover:scale-125 hover:stroke-red-400 transition', { 'fill-red-600 stroke-red-600': isLiked })} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MediaModal item={item} onClose={(): void => setIsModalOpen(false)} />
      )}

    </Fragment>
  );
}