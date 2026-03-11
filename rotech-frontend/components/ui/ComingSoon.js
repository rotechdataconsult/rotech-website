import Link from 'next/link'

// ── Full-page coming soon wrapper ──────────────────────────────────────────────
export function ComingSoonPage({ icon = '🚀', title, description, backHref = '/dashboard', backLabel = '← Back to Dashboard' }) {
  return (
    <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">{icon}</div>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[#9B4FDE]/40 bg-[#9B4FDE]/15 text-[#C8D4E8] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9B4FDE] animate-pulse" />
            Coming Soon
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2">{title}</h1>
          <p className="text-[#E8E0F0] text-sm mt-3 leading-relaxed">{description}</p>
        </div>
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-5 text-sm text-[#E8E0F0]">
          We are actively building this feature. It will be available soon.
        </div>
        <Link href={backHref}
          className="inline-block text-sm font-semibold text-[#C8D4E8] hover:text-white transition-colors">
          {backLabel}
        </Link>
      </div>
    </div>
  )
}

// ── Inline coming-soon button/badge ───────────────────────────────────────────
export function ComingSoonBadge({ label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#9B4FDE]/20 border border-[#9B4FDE]/30 text-[#C8D4E8] cursor-not-allowed ${className}`}>
      <span className="w-1 h-1 rounded-full bg-[#9B4FDE] animate-pulse" />
      {label ?? 'Coming Soon'}
    </span>
  )
}

// ── Coming-soon button replacement ─────────────────────────────────────────────
export function ComingSoonButton({ icon, label, description, className = '' }) {
  return (
    <div
      title="This feature is coming soon"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-[#9B4FDE]/20 bg-[#7B2FBE]/40 cursor-not-allowed opacity-70 ${className}`}>
      {icon && <span className="text-xl shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{label}</p>
          <ComingSoonBadge />
        </div>
        {description && <p className="text-xs text-[#C8D4E8] mt-0.5">{description}</p>}
      </div>
    </div>
  )
}
