export default function Card({ children, className = '', highlight = false }) {
  return (
    <div
      className={`
        bg-[#7B2FBE] rounded-xl border p-6
        ${highlight ? 'border-[#9B4FDE]' : 'border-[#9B4FDE]/30'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value }) {
  return (
    <Card className="px-5 py-5">
      <p className="text-2xl font-extrabold" style={{ color: '#9B4FDE' }}>{value}</p>
      <p className="mt-1 text-sm text-[#E8E0F0]">{label}</p>
    </Card>
  )
}
