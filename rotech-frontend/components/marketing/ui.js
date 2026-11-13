// ── Icons (inline, inherit text colour) ────────────────────────────────────────

export const ICON_PATHS = {
  chart:  'M3 3v18h18M8 17V11m4 6V7m4 10v-4',
  bolt:   'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  users:  'M17 20v-2a4 4 0 00-3-3.87M9 20H3v-2a4 4 0 014-4h2a4 4 0 014 4v2H9zm7-13a3 3 0 11-2 5.2M11 7a3 3 0 11-6 0 3 3 0 016 0z',
  search: 'M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  pulse:  'M3 12h4l3-8 4 16 3-8h4',
  arrow:  'M5 12h14m-6-6l6 6-6 6',
  check:  'M5 13l4 4L19 7',
  clock:  'M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z',
  book:   'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zm0 14a2 2 0 012-2h13',
  upload: 'M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3',
  chat:   'M21 12a8 8 0 01-11.8 7L4 20l1.1-4.6A8 8 0 1121 12z',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

// Level is shown as text plus a bar count, never by colour alone.
export function LevelBadge({ level }) {
  const filled = level === 'Advanced' ? 3 : level === 'Intermediate' ? 2 : 1
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-brand-800">
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {['h-1.5', 'h-2.5', 'h-3.5'].map((h, i) => (
          <span key={h} className={`w-1 rounded-sm ${h} ${i < filled ? 'bg-brand-600' : 'bg-brand-200'}`} />
        ))}
      </span>
      {level}
    </span>
  )
}

export function Eyebrow({ children, onDark = false }) {
  return (
    <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${onDark ? 'text-sun-400' : 'text-brand-600'}`}>
      {children}
    </p>
  )
}

export const H2 = 'font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl'
export const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700'
export const BTN_SUN = 'inline-flex items-center justify-center gap-2 rounded-full bg-sun-400 px-7 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:bg-sun-300'
export const BTN_GHOST_DARK = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-brand-900'

