'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { ComingSoonBadge } from '@/components/ui/ComingSoon'

const TOOL_COLORS = {
  Excel:       'bg-green-500/15 text-green-400',
  SQL:         'bg-blue-500/15 text-blue-400',
  'Power BI':  'bg-yellow-500/15 text-yellow-400',
  Python:      'bg-purple-500/15 text-purple-400',
  Capstone:    'bg-pink-500/15 text-pink-400',
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [enrollment,   setEnrollment]   = useState(null)
  const [domain,       setDomain]       = useState(null)
  const [modules,      setModules]      = useState([])
  const [completed,    setCompleted]    = useState(0)
  const [totalLessons, setTotalLessons] = useState(0)
  const [certificate,  setCertificate]  = useState(null)
  const [dataLoading,  setDataLoading]  = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select('*, domains(*)')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!enrollData) { setDataLoading(false); return }

      setEnrollment(enrollData)
      setDomain(enrollData.domains)

      const [
        { data: moduleData },
        { count: completedCount },
        { data: certData },
      ] = await Promise.all([
        supabase.from('modules').select('id, title, tool, order_index')
          .eq('domain_id', enrollData.domain_id).order('order_index'),
        supabase.from('progress').select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase.from('certificates').select('*')
          .eq('user_id', user.id).eq('domain_id', enrollData.domain_id).maybeSingle(),
      ])

      setModules(moduleData ?? [])
      setCompleted(completedCount ?? 0)
      setCertificate(certData)

      if (moduleData?.length) {
        const { count: total } = await supabase
          .from('lessons').select('*', { count: 'exact', head: true })
          .in('module_id', moduleData.map(m => m.id))
        setTotalLessons(total ?? 0)
      }
      setDataLoading(false)
    }
    load()
  }, [user])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <svg className="animate-spin h-8 w-8" style={{ color: '#8B5CF6' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0F172A' }}>

      {/* Nav */}
      <nav className="px-6 py-4 sticky top-0 z-40"
        style={{ backgroundColor: 'rgba(15,23,42,0.97)', borderBottom: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(14px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/resources" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Resources</Link>
            <Link href="/data-entry" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Data Entry</Link>
            <Link href="/analyst" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Analyst Tool</Link>
            <span className="text-sm text-slate-300 font-medium hidden sm:block">{profile?.full_name}</span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded-lg border text-slate-300 hover:text-white transition-colors"
              style={{ borderColor: 'rgba(100,116,139,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,116,139,0.4)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Welcome header */}
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, <span style={{ color: '#8B5CF6' }}>{profile?.full_name}</span>!
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            {domain ? (
              <span>Your domain: <span className="text-white font-semibold">{domain.icon} {domain.title}</span></span>
            ) : 'You have not selected a domain yet.'}
          </p>
        </div>

        {/* No enrollment CTA */}
        {!enrollment && (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <p className="text-4xl mb-3">🎯</p>
            <h2 className="text-lg font-bold text-white mb-2">Choose Your Learning Domain</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              Select one industry domain to begin your structured data analytics journey.
            </p>
            <Link href="/courses"
              className="inline-block text-sm font-semibold px-6 py-2.5 rounded-lg text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: '#6C3FD4' }}>
              Browse Domains →
            </Link>
          </div>
        )}

        {enrollment && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Domain',        value: domain?.title?.split(' ')[0] ?? '—' },
                { label: 'Lessons Done',  value: completed },
                { label: 'Total Lessons', value: totalLessons },
                { label: 'Certificate',   value: certificate ? '✓' : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-5 py-5" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
                  <p className="text-2xl font-extrabold" style={{ color: '#8B5CF6' }}>{value}</p>
                  <p className="mt-1 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white">Overall Progress</h2>
                <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #6C3FD4, #8B5CF6)' }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{completed} of {totalLessons} lessons completed</p>
            </div>

            {/* Modules */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Your Modules</h2>
                <Link href={`/courses/${enrollment.domain_id}`} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">View all →</Link>
              </div>
              {modules.length === 0 ? (
                <p className="text-sm text-slate-400">Modules are being prepared. Check back soon.</p>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod, i) => (
                    <Link key={mod.id} href={`/courses/${enrollment.domain_id}/${mod.id}`}
                      className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors"
                      style={{ backgroundColor: '#0F172A', border: '1px solid rgba(51,65,85,0.4)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)'}
                    >
                      <span className="text-xs font-bold text-slate-500 w-5 shrink-0">{i + 1}</span>
                      <p className="flex-1 text-sm font-medium text-white truncate">{mod.title}</p>
                      {mod.tool && (
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${TOOL_COLORS[mod.tool] ?? 'bg-violet-500/20 text-violet-300'}`}>
                          {mod.tool}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/data-entry"
                className="rounded-xl p-5 flex items-center gap-4 transition-all"
                style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'}
              >
                <span className="text-2xl">📝</span>
                <div>
                  <p className="text-sm font-bold text-white">Business Data Entry</p>
                  <p className="text-xs text-slate-400 mt-0.5">Record sales, expenses & inventory</p>
                </div>
              </Link>
              <Link href="/analyst"
                className="rounded-xl p-5 flex items-center gap-4 transition-all"
                style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'}
              >
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-sm font-bold text-white">AI Analyst Tool</p>
                  <p className="text-xs text-slate-400 mt-0.5">Upload data for AI-powered insights</p>
                </div>
              </Link>
            </div>

            {/* Coming soon features */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">Coming Soon</h2>
                <Link href="/pricing" className="text-xs text-slate-400 hover:text-white transition-colors">
                  View pricing →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: '/analyst/history', icon: '📂', label: 'Analysis History',  desc: 'Revisit past AI analyses' },
                  { href: '/invoice',         icon: '🧾', label: 'Invoice Generator',  desc: 'Create PDF invoices from sales' },
                  { href: '/team',            icon: '👥', label: 'Team Accounts',      desc: 'Add staff to your account' },
                  { href: '/whatsapp',        icon: '💬', label: 'WhatsApp Data Bot',  desc: 'Send data via WhatsApp' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                    style={{ border: '1px solid rgba(51,65,85,0.4)', backgroundColor: 'rgba(15,23,42,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)'}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-white">{item.label}</p>
                        <ComingSoonBadge />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Certificate */}
            {certificate && (
              <div className="rounded-xl p-6 flex items-center gap-4"
                style={{ backgroundColor: '#1E293B', border: '1px solid rgba(234,179,8,0.3)' }}>
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-white">Certificate Earned!</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Code: <span className="font-mono text-white">{certificate.verification_code}</span></p>
                </div>
                <Link href={`/courses/${enrollment.domain_id}/certificate`}
                  className="shrink-0 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#6C3FD4' }}>
                  View
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
