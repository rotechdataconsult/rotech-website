import Link from 'next/link'
import { LessonTypeBadge } from '@/components/ui/Badge'

export default function LessonItem({ lesson, moduleId, domainId, isCompleted, index }) {
  return (
    <Link
      href={`/courses/${domainId}/${moduleId}/${lesson.id}`}
      className="flex items-center gap-4 rounded-lg px-4 py-3 transition-all group"
      style={{
        backgroundColor: isCompleted ? 'rgba(34,197,94,0.08)' : '#0F172A',
        border: isCompleted ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(51,65,85,0.4)',
      }}
      onMouseEnter={e => { if (!isCompleted) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
      onMouseLeave={e => { if (!isCompleted) e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)' }}
    >
      {/* Number / checkmark */}
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={isCompleted
          ? { backgroundColor: 'rgba(34,197,94,0.2)', color: '#86efac' }
          : { backgroundColor: 'rgba(139,92,246,0.15)', color: '#94A3B8' }}
      >
        {isCompleted ? '✓' : index + 1}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCompleted ? 'text-green-300' : 'text-white'}`}>
          {lesson.title}
        </p>
      </div>

      {/* Type badge */}
      <LessonTypeBadge type={lesson.lesson_type ?? 'reading'} />

      {/* Arrow */}
      <svg className="h-4 w-4 text-violet-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
