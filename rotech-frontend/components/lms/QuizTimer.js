'use client'

import { useEffect, useState } from 'react'

export default function QuizTimer({ durationMins = 15, onExpire }) {
  const total = durationMins * 60
  const [seconds, setSeconds] = useState(total)

  useEffect(() => {
    if (seconds <= 0) { onExpire?.(); return }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, onExpire])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const pct  = (seconds / total) * 100
  const isLow = seconds < 60

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-bold
      ${isLow
        ? 'border-red-500/50 bg-red-500/10 text-red-400'
        : 'border-[#9B4FDE]/40 bg-[#6B28A8] text-white'}`}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}
