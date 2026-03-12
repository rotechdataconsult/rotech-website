export default function Spinner({ size = 8, className = '' }) {
  return (
    <svg
      className={`animate-spin h-${size} w-${size} ${className}`}
      style={{ color: '#9B4FDE' }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center">
      <Spinner size={8} />
    </div>
  )
}
