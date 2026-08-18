'use client'

import { useState } from 'react'
import { getThumbnail, getEmbedUrl } from '@/lib/youtube'
import { ToolBadge } from '@/components/ui/Badge'

export default function VideoCard({ resource }) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = getThumbnail(resource.youtube_url)
  const embedUrl  = getEmbedUrl(resource.youtube_url)

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all"
      style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'}
    >
      {/* Video area */}
      <div className="relative w-full aspect-video bg-black">
        {playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play ${resource.title}`}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
                <span className="text-4xl">&#9654;</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: 'rgba(108,63,212,0.9)' }}>
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 flex-1">
            {resource.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {resource.tool && <ToolBadge tool={resource.tool} size="xs" />}
          {resource.domains?.title && (
            <span className="text-xs text-slate-400">{resource.domains.title}</span>
          )}
        </div>
      </div>
    </div>
  )
}
