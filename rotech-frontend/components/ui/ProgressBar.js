export default function ProgressBar({ value = 0, max = 100, showLabel = true, size = 'md' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs text-slate-400">
          <span>{value} of {max} completed</span>
          <span className="font-bold" style={{ color: '#8B5CF6' }}>{pct}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full overflow-hidden`} style={{ backgroundColor: '#0F172A' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6C3FD4, #8B5CF6)' }}
        />
      </div>
    </div>
  )
}
