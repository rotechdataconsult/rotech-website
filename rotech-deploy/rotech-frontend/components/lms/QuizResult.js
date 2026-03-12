'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { PASS_MARK } from '@/lib/constants'

export default function QuizResult({ score, total, passed, onRetry, nextHref, moduleTitle }) {
  const pct = Math.round((score / total) * 100)

  return (
    <div className="text-center space-y-6">
      {/* Score circle */}
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={passed ? '#22c55e' : '#ef4444'}
            strokeWidth="2.5"
            strokeDasharray={`${pct} 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{pct}%</span>
          <span className="text-xs text-[#C8D4E8]">{score}/{total}</span>
        </div>
      </div>

      {/* Result label */}
      <div>
        <p className={`text-2xl font-extrabold mb-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {passed ? 'Quiz Passed!' : 'Not Quite'}
        </p>
        <p className="text-[#E8E0F0] text-sm">
          {passed
            ? `Great work on ${moduleTitle}. You scored ${pct}%.`
            : `You need ${PASS_MARK}% to pass. You scored ${pct}%. Keep going!`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onRetry}>
          Retake Quiz
        </Button>
        {passed && nextHref && (
          <Link
            href={nextHref}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg"
            style={{ backgroundColor: '#9B4FDE' }}
          >
            Continue Learning
          </Link>
        )}
      </div>
    </div>
  )
}
