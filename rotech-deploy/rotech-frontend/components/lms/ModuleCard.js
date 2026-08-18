import Link from 'next/link'
import { ToolBadge } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'

export default function ModuleCard({ module, domainId, completedLessons, totalLessons, index }) {
  const isComplete = totalLessons > 0 && completedLessons === totalLessons

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all"
      style={{
        backgroundColor: '#1E293B',
        border: isComplete
          ? '1px solid rgba(34,197,94,0.4)'
          : '1px solid rgba(51,65,85,0.5)',
      }}
      onMouseEnter={e => { if (!isComplete) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
      onMouseLeave={e => { if (!isComplete) e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: '#0F172A' }}>
          {isComplete ? '✓' : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug">{module.title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{module.duration_hours ?? 2}h estimated</p>
        </div>
        {module.tool && <ToolBadge tool={module.tool} size="xs" />}
      </div>

      {/* Description */}
      {module.description && (
        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{module.description}</p>
      )}

      {/* Progress */}
      <ProgressBar value={completedLessons} max={totalLessons || 1} size="sm" />

      {/* Action */}
      <Link
        href={`/courses/${domainId}/${module.id}`}
        className="w-full text-center text-xs font-semibold py-2 rounded-lg transition-all text-violet-400 hover:text-white"
        style={{ border: '1px solid rgba(139,92,246,0.4)' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6C3FD4'; e.currentTarget.style.borderColor = '#6C3FD4'; e.currentTarget.style.color = 'white' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = '#A78BFA' }}
      >
        {isComplete ? 'Review Module' : completedLessons > 0 ? 'Continue →' : 'Start Module →'}
      </Link>
    </div>
  )
}
