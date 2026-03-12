import Link from 'next/link'
import { LessonTypeBadge } from '@/components/ui/Badge'

export default function LessonItem({ lesson, moduleId, domainId, isCompleted, index }) {
  return (
    <Link
      href={`/courses/${domainId}/${moduleId}/${lesson.id}`}
      className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors group
        ${isCompleted ? 'bg-green-500/10 border border-green-500/20' : 'bg-[#6B28A8] hover:bg-[#7B2FBE]'}`}
    >
      {/* Number / checkmark */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-[#9B4FDE]/20 text-[#C8D4E8]'}`}
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
      <svg className="h-4 w-4 text-[#9B4FDE] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
