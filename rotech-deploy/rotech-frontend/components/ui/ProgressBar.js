export default function ProgressBar({ value = 0, max = 100, showLabel = true, size = 'md' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs text-[#E8E0F0]">
          <span>{value} of {max} completed</span>
          <span className="font-bold" style={{ color: '#9B4FDE' }}>{pct}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-[#6B28A8] rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: '#9B4FDE' }}
        />
      </div>
    </div>
  )
}
