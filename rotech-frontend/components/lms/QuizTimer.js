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
  const isLow = seconds < 60

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-bold"
      style={isLow
        ? { borderColor: 'rgba(239,68,68,0.5)', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }
        : { borderColor: 'rgba(51,65,85,0.6)', backgroundColor: '#0F172A', color: 'white' }}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}
