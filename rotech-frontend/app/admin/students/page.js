'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminStudentsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [rows,        setRows]        = useState([])   // enriched enrollment rows
  const [domains,     setDomains]     = useState([])
  const [filterDomain,setFilterDomain]= useState('')
  const [search,      setSearch]      = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    if (profile && profile.role !== 'admin') { router.push('/dashboard'); return }
    load()
  }, [user, profile, router])

  async function load() {
    // 1. Enrollments + user profiles + domain info
    const { data: enrollData } = await supabase
      .from('enrollments')
      .select('*, users(full_name, email), domains(id, title, icon)')
      .order('created_at', { ascending: false })

    // 2. Domains for filter
    const { data: domainData } = await supabase.from('domains').select('id, title, icon').order('title')
    setDomains(domainData ?? [])

    if (!enrollData?.length) { setRows([]); setDataLoading(false); return }

    // 3. Certificates
    const { data: certData } = await supabase.from('certificates').select('user_id, domain_id, score, verification_code')

    const certSet = new Set((certData ?? []).map(c => `${c.user_id}:${c.domain_id}`))

    // 4. Progress counts per user (all domains)
    const userIds = [...new Set(enrollData.map(e => e.user_id))]
    const { data: progressData } = await supabase
      .from('progress')
      .select('lesson_id, user_id')
      .in('user_id', userIds)

    const progressByUser = {}
    for (const p of progressData ?? []) {
      progressByUser[p.user_id] = (progressByUser[p.user_id] ?? 0) + 1
    }

    // 5. Quiz attempts per user (pass count)
    const { data: attemptData } = await supabase
      .from('quiz_attempts')
      .select('user_id, passed')
      .in('user_id', userIds)

    const quizPassByUser = {}
    for (const a of attemptData ?? []) {
      if (!quizPassByUser[a.user_id]) quizPassByUser[a.user_id] = 0
      if (a.passed) quizPassByUser[a.user_id]++
    }

    const enriched = enrollData.map(e => ({
      id:          e.id,
      user_id:     e.user_id,
      name:        e.users?.full_name ?? '—',
      email:       e.users?.email ?? '—',
      domain:      e.domains,
      enrolled_at: e.created_at,
      lessons:     progressByUser[e.user_id] ?? 0,
      quizPasses:  quizPassByUser[e.user_id] ?? 0,
      certified:   certSet.has(`${e.user_id}:${e.domain_id}`),
    }))

    setRows(enriched)
    setDataLoading(false)
  }

  if (authLoading || dataLoading) return <PageSpinner />

  const filtered = rows.filter(r => {
    const matchDomain = !filterDomain || r.domain?.id === filterDomain
    const q = search.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    return matchDomain && matchSearch
  })

  const certified = rows.filter(r => r.certified).length

  return (
    <AdminLayout profile={profile} title="Student Tracking">

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Enrolled Students', value: rows.length },
          { label: 'Certificates Issued', value: certified },
          { label: 'Completion Rate', value: rows.length ? `${Math.round((certified / rows.length) * 100)}%` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-5 py-4 text-center">
            <p className="text-2xl font-extrabold" style={{ color: '#9B4FDE' }}>{value}</p>
            <p className="text-xs text-[#E8E0F0] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-4 py-2 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition w-64"
        />
        <select
          value={filterDomain}
          onChange={e => setFilterDomain(e.target.value)}
          className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
        >
          <option value="">All domains</option>
          {domains.map(d => <option key={d.id} value={d.id}>{d.icon} {d.title}</option>)}
        </select>
        <p className="text-xs text-[#C8D4E8] self-center">Showing {filtered.length} of {rows.length}</p>
      </div>

      {/* Table */}
      <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#9B4FDE]/20">
                {['Student', 'Domain', 'Lessons Done', 'Quiz Passes', 'Certificate', 'Enrolled'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#C8D4E8] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#C8D4E8] text-sm">
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#9B4FDE]/10 hover:bg-[#6B28A8]/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-[#6B28A8]/10'
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{row.name}</p>
                    <p className="text-xs text-[#C8D4E8]">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.domain ? (
                      <span className="text-sm text-white">{row.domain.icon} {row.domain.title}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold" style={{ color: '#9B4FDE' }}>{row.lessons}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-white">{row.quizPasses}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.certified ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                        &#127942; Issued
                      </span>
                    ) : (
                      <span className="text-xs text-[#C8D4E8]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-[#C8D4E8]">
                      {new Date(row.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
