'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

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
      <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8" style={{ color: '#9B4FDE' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/resources" className="text-sm text-[#E8E0F0] hover:text-white transition-colors">Resources</Link>
            <Link href="/analyst" className="text-sm text-[#E8E0F0] hover:text-white transition-colors">Analyst Tool</Link>
            <span className="text-sm text-[#E8E0F0] font-medium">{profile?.full_name}</span>
            <button onClick={handleLogout} className="text-sm px-4 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:border-[#9B4FDE] hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, <span style={{ color: '#C8D4E8' }}>{profile?.full_name}</span>!
          </h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">
            {domain ? (
              <span>Your domain: <span className="text-white font-semibold">{domain.icon} {domain.title}</span></span>
            ) : 'You have not selected a domain yet.'}
          </p>
        </div>

        {!enrollment && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <h2 className="text-lg font-bold text-white mb-2">Choose Your Learning Domain</h2>
            <p className="text-[#E8E0F0] text-sm mb-6 max-w-md mx-auto">
              Select one industry domain to begin your structured data analytics journey.
            </p>
            <Link href="/courses" className="inline-block text-sm font-semibold px-6 py-2.5 rounded-lg text-white" style={{ backgroundColor: '#9B4FDE' }}>
              Browse Domains →
            </Link>
          </div>
        )}

        {enrollment && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Domain',        value: domain?.title?.split(' ')[0] ?? '—' },
                { label: 'Lessons Done',  value: completed },
                { label: 'Total Lessons', value: totalLessons },
                { label: 'Certificate',   value: certificate ? '✓' : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-5 py-5">
                  <p className="text-2xl font-extrabold" style={{ color: '#9B4FDE' }}>{value}</p>
                  <p className="mt-1 text-sm text-[#E8E0F0]">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white">Overall Progress</h2>
                <span className="text-sm font-bold" style={{ color: '#9B4FDE' }}>{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#6B28A8] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: '#9B4FDE' }} />
              </div>
              <p className="mt-2 text-xs text-[#E8E0F0]">{completed} of {totalLessons} lessons completed</p>
            </div>

            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Your Modules</h2>
                <Link href={`/courses/${enrollment.domain_id}`} className="text-xs font-medium" style={{ color: '#C8D4E8' }}>View all →</Link>
              </div>
              {modules.length === 0 ? (
                <p className="text-sm text-[#C8D4E8]">Modules are being prepared. Check back soon.</p>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod, i) => (
                    <Link key={mod.id} href={`/courses/${enrollment.domain_id}/${mod.id}`}
                      className="flex items-center gap-4 bg-[#6B28A8] rounded-lg px-4 py-3 hover:bg-[#7B2FBE] transition-colors">
                      <span className="text-xs font-bold text-[#C8D4E8] w-5 shrink-0">{i + 1}</span>
                      <p className="flex-1 text-sm font-medium text-white truncate">{mod.title}</p>
                      {mod.tool && (
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${TOOL_COLORS[mod.tool] ?? 'bg-[#9B4FDE]/20 text-[#E8E0F0]'}`}>
                          {mod.tool}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {certificate && (
              <div className="bg-[#7B2FBE] border border-yellow-500/30 rounded-xl p-6 flex items-center gap-4">
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-white">Certificate Earned!</h2>
                  <p className="text-xs text-[#E8E0F0] mt-0.5">Code: <span className="font-mono text-white">{certificate.verification_code}</span></p>
                </div>
                <Link href={`/courses/${enrollment.domain_id}/certificate`}
                  className="shrink-0 text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#9B4FDE' }}>
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
