'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Click-to-play video. Only the small poster image loads with the page; the
 * video file is requested when the visitor presses play, which keeps the page
 * fast and saves mobile data.
 */
export default function VideoCard({ src, poster, title, duration, alt, className = '' }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className={`relative aspect-[9/16] overflow-hidden rounded-3xl bg-brand-950 shadow-xl shadow-brand-900/20 ring-4 ring-white ${className}`}>
      {playing ? (
        <video src={src} poster={poster} controls autoPlay playsInline preload="metadata" className="h-full w-full object-cover" aria-label={title} />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block h-full w-full text-left" aria-label={`Play video: ${title} (${duration})`}>
          <Image src={poster} alt={alt} fill sizes="(min-width: 1024px) 220px, 45vw" className="object-cover transition duration-300 group-hover:scale-105" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
          <span aria-hidden="true" className="absolute left-1/2 top-[64%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sun-400 text-ink shadow-lg ring-4 ring-white transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="block text-sm font-bold leading-snug">{title}</span>
            <span className="mt-0.5 block text-xs font-semibold text-sun-400">Video · {duration}</span>
          </figcaption>
        </button>
      )}
    </figure>
  )
}
