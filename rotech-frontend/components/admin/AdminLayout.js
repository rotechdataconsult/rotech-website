'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',           label: 'Dashboard',    icon: '&#9671;' },
  { href: '/admin/domains',   label: 'Domains',      icon: '&#127760;' },
  { href: '/admin/modules',   label: 'Modules',      icon: '&#128218;' },
  { href: '/admin/lessons',   label: 'Lessons',      icon: '&#128196;' },
  { href: '/admin/quizzes',   label: 'Quizzes',      icon: '&#9997;&#65039;' },
  { href: '/admin/exam',      label: 'Final Exam',   icon: '&#127891;' },
  { href: '/admin/youtube',   label: 'YouTube',      icon: '&#9654;&#65039;' },
  { href: '/admin/students',  label: 'Students',     icon: '&#128101;' },
]

export default function AdminLayout({ profile, title, children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#5a1f9a] flex">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-52 shrink-0 bg-[#3d1270] border-r border-[#9B4FDE]/20 flex flex-col">
        <div className="px-5 py-5 border-b border-[#9B4FDE]/20">
          <p className="text-xs text-[#9B4FDE] font-semibold uppercase tracking-widest">Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5 truncate">{profile?.full_name}</p>
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#9B4FDE]/25 text-white font-semibold'
                    : 'text-[#C8D4E8] hover:text-white hover:bg-[#9B4FDE]/10'
                }`}
                dangerouslySetInnerHTML={{ __html: `<span class="text-sm w-4 shrink-0">${icon}</span><span>${label}</span>` }}
              />
            )
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[#9B4FDE]/20">
          <Link href="/dashboard" className="text-xs text-[#C8D4E8] hover:text-white transition-colors">
            &#8592; Back to App
          </Link>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 text-white">
        <header className="bg-[#4a1580] border-b border-[#9B4FDE]/20 px-8 py-4 shrink-0">
          <h1 className="text-base font-bold text-white">{title}</h1>
        </header>
        <main className="flex-1 px-8 py-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
