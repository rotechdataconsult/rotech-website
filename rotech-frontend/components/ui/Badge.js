import { TOOL_CLASS } from '@/lib/constants'

export function ToolBadge({ tool, size = 'sm' }) {
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`rounded-full border font-medium ${sizeClass} ${TOOL_CLASS(tool)}`}>
      {tool}
    </span>
  )
}

export function StatusBadge({ status }) {
  const styles = {
    active:    'bg-green-500/15 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    locked:    'bg-[#9B4FDE]/20 text-[#C8D4E8] border-[#9B4FDE]/20',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${styles[status] ?? styles.locked}`}>
      {status}
    </span>
  )
}

export function LessonTypeBadge({ type }) {
  const styles = {
    reading:  'bg-[#9B4FDE]/20 text-[#E8E0F0]',
    exercise: 'bg-yellow-500/15 text-yellow-400',
    project:  'bg-pink-500/15 text-pink-400',
  }
  const icons = { reading: '📖', exercise: '✏️', project: '🛠️' }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[type] ?? styles.reading}`}>
      {icons[type]} {type}
    </span>
  )
}
