import Link from 'next/link'
import { ToolBadge } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'

export default function ModuleCard({ module, domainId, completedLessons, totalLessons, index }) {
  const isLocked = false // extend later: unlock sequentially
  const isComplete = totalLessons > 0 && completedLessons === totalLessons

  return (
    <div className={`bg-[#7B2FBE] border rounded-xl p-5 flex flex-col gap-4 transition-all
      ${isComplete ? 'border-green-500/40' : 'border-[#9B4FDE]/30 hover:border-[#9B4FDE]/60'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#6B28A8] flex items-center justify-center text-xs font-bold text-white">
          {isComplete ? '✓' : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug">{module.title}</h3>
          <p className="text-[#C8D4E8] text-xs mt-0.5">{module.duration_hours ?? 2}h estimated</p>
        </div>
        {module.tool && <ToolBadge tool={module.tool} size="xs" />}
      </div>

      {/* Description */}
      {module.description && (
        <p className="text-[#E8E0F0] text-xs leading-relaxed line-clamp-2">{module.description}</p>
      )}

      {/* Progress */}
      <ProgressBar value={completedLessons} max={totalLessons || 1} size="sm" />

      {/* Action */}
      <Link
        href={`/courses/${domainId}/${module.id}`}
        className="w-full text-center text-xs font-semibold py-2 rounded-lg border border-[#9B4FDE]/50 text-[#9B4FDE] hover:bg-[#9B4FDE] hover:text-white transition-all"
      >
        {isComplete ? 'Review Module' : completedLessons > 0 ? 'Continue →' : 'Start Module →'}
      </Link>
    </div>
  )
}
