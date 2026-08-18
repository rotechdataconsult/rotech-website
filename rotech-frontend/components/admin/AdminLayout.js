'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { href: '/admin',           label: 'Dashboard',    icon: '◇' },
      { href: '/admin/domains',   label: 'Domains',      icon: '🌐' },
      { href: '/admin/modules',   label: 'Modules',      icon: '📚' },
      { href: '/admin/lessons',   label: 'Lessons',      icon: '📄' },
      { href: '/admin/quizzes',   label: 'Quizzes',      icon: '✏️' },
      { href: '/admin/exam',      label: 'Final Exam',   icon: '🎓' },
      { href: '/admin/youtube',   label: 'YouTube',      icon: '▶️' },
      { href: '/admin/students',  label: 'Students',     icon: '👥' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/cms',       label: 'Landing CMS',  icon: '🎨' },
    ],
  },
]

export default function AdminLayout({ profile, title, children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F172A' }}>

      {/* Sidebar */}
      <aside className="w-52 shrink-0 flex flex-col"
        style={{ backgroundColor: '#0A0F1E', borderRight: '1px solid rgba(51,65,85,0.6)' }}>
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B5CF6' }}>Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5 truncate">{profile?.full_name}</p>
        </div>

        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-xs font-bold uppercase tracking-widest px-3 mb-1 text-slate-600">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon }) => {
                  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: active ? 'rgba(139,92,246,0.2)' : 'transparent',
                        color: active ? 'white' : '#94A3B8',
                        fontWeight: active ? 600 : 400,
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.1)' } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent' } }}
                    >
                      <span className="text-sm w-4 shrink-0">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
            &#8592; Back to App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 text-white">
        <header className="px-8 py-4 shrink-0"
          style={{ backgroundColor: '#0F172A', borderBottom: '1px solid rgba(51,65,85,0.6)' }}>
          <h1 className="text-base font-bold text-white">{title}</h1>
        </header>
        <main className="flex-1 px-8 py-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
