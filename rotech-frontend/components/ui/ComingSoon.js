import Link from 'next/link'

// ── Full-page coming soon wrapper ──────────────────────────────────────────────
export function ComingSoonPage({ icon = '🚀', title, description, backHref = '/dashboard', backLabel = '← Back to Dashboard' }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0F172A' }}>
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">{icon}</div>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border mb-4"
            style={{ borderColor: 'rgba(139,92,246,0.4)', backgroundColor: 'rgba(108,63,212,0.12)', color: '#94A3B8' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6' }} />
            Coming Soon
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2">{title}</h1>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">{description}</p>
        </div>
        <div className="rounded-xl p-5 text-sm text-slate-300"
          style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          We are actively building this feature. It will be available soon.
        </div>
        <Link href={backHref}
          className="inline-block text-sm font-semibold text-slate-400 hover:text-white transition-colors">
          {backLabel}
        </Link>
      </div>
    </div>
  )
}

// ── Inline coming-soon badge ───────────────────────────────────────────────────
export function ComingSoonBadge({ label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full cursor-not-allowed ${className}`}
      style={{ backgroundColor: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#94A3B8' }}>
      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6' }} />
      {label ?? 'Coming Soon'}
    </span>
  )
}

// ── Coming-soon button replacement ─────────────────────────────────────────────
export function ComingSoonButton({ icon, label, description, className = '' }) {
  return (
    <div
      title="This feature is coming soon"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-not-allowed opacity-60 ${className}`}
      style={{ border: '1px solid rgba(51,65,85,0.5)', backgroundColor: 'rgba(30,41,59,0.5)' }}>
      {icon && <span className="text-xl shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{label}</p>
          <ComingSoonBadge />
        </div>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}
