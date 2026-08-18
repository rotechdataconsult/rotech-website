export default function Card({ children, className = '', highlight = false }) {
  return (
    <div
      className={`rounded-xl border p-6 ${className}`}
      style={{
        backgroundColor: '#1E293B',
        borderColor: highlight ? 'rgba(139,92,246,0.6)' : 'rgba(51,65,85,0.5)',
      }}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value }) {
  return (
    <Card className="px-5 py-5">
      <p className="text-2xl font-extrabold" style={{ color: '#8B5CF6' }}>{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </Card>
  )
}
