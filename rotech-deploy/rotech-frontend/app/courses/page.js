'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

const TOOL_COLORS = {
  Excel:      'bg-green-500/15 text-green-400 border-green-500/30',
  SQL:        'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Power BI': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Python:     'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

function ConfirmModal({ domain, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl p-8 max-w-md w-full shadow-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.7)' }}>
        <div className="text-4xl text-center mb-4">{domain.icon}</div>
        <h2 className="text-xl font-bold text-white text-center mb-2">
          Enroll in {domain.title}?
        </h2>
        <p className="text-slate-300 text-sm text-center mb-6">
          You can only be enrolled in{' '}
          <span className="text-white font-semibold">one domain at a time</span>.
          Choose carefully — this will be your learning track until you complete it.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-slate-300 text-sm font-medium hover:text-white transition-colors"
            style={{ border: '1px solid rgba(100,116,139,0.4)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: '#6C3FD4' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Enrolling...
              </>
            ) : 'Yes, Enroll Me'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DomainCard({ domain, enrollment, onSelect }) {
  const isEnrolled = enrollment?.domain_id === domain.id
  const isLocked   = enrollment && !isEnrolled

  return (
    <div
      className={`rounded-xl p-6 flex flex-col gap-4 transition-all ${isLocked ? 'opacity-50' : ''}`}
      style={{
        backgroundColor: '#1E293B',
        border: isEnrolled
          ? '1px solid rgba(139,92,246,0.6)'
          : '1px solid rgba(51,65,85,0.5)',
        boxShadow: isEnrolled ? '0 0 0 1px rgba(139,92,246,0.2)' : 'none',
      }}
      onMouseEnter={e => { if (!isLocked && !isEnrolled) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
      onMouseLeave={e => { if (!isLocked && !isEnrolled) e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{domain.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base leading-tight">{domain.title}</h3>
          {isEnrolled && (
            <span className="mt-0.5 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
              Your Domain
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed flex-1 line-clamp-3">
        {domain.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {['Excel', 'SQL', 'Power BI', 'Python'].map(tool => (
          <span key={tool} className={`text-xs px-2 py-0.5 rounded-full border ${TOOL_COLORS[tool]}`}>
            {tool}
          </span>
        ))}
      </div>

      {isEnrolled ? (
        <Link
          href={`/courses/${domain.id}`}
          className="w-full text-center text-sm font-semibold py-2.5 rounded-lg text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#6C3FD4' }}
        >
          Continue Learning →
        </Link>
      ) : isLocked ? (
        <div className="w-full text-center text-xs py-2.5 rounded-lg cursor-not-allowed text-slate-600"
          style={{ border: '1px solid rgba(51,65,85,0.3)' }}>
          Complete your current domain first
        </div>
      ) : (
        <button
          onClick={() => onSelect(domain)}
          className="w-full text-sm font-semibold py-2.5 rounded-lg transition-all hover:text-white"
          style={{ border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6C3FD4'; e.currentTarget.style.borderColor = '#6C3FD4'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = '#8B5CF6' }}
        >
          Select Domain
        </button>
      )}
    </div>
  )
}

export default function CoursesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [domains,     setDomains]     = useState([])
  const [enrollment,  setEnrollment]  = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [enrolling,   setEnrolling]   = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: domainData }, { data: enrollData }] = await Promise.all([
        supabase.from('domains').select('*').eq('is_active', true).order('title'),
        supabase.from('enrollments').select('*').eq('user_id', user.id).maybeSingle(),
      ])
      setDomains(domainData ?? [])
      setEnrollment(enrollData)
      setDataLoading(false)
    }
    load()
  }, [user])

  async function handleEnroll() {
    if (!selected) return
    setEnrolling(true)
    setError('')
    const { error: err } = await supabase.from('enrollments').insert({
      user_id: user.id,
      domain_id: selected.id,
      status: 'active',
    })
    if (err) {
      setError('Enrollment failed. You may already be enrolled in a domain.')
      setEnrolling(false)
      setSelected(null)
      return
    }
    router.push(`/courses/${selected.id}`)
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

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0F172A' }}>

      {/* Nav */}
      <nav className="px-6 py-4 sticky top-0 z-40"
        style={{ backgroundColor: 'rgba(15,23,42,0.97)', borderBottom: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(14px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white">Choose Your Domain</h1>
          <p className="mt-2 text-slate-300 text-sm max-w-xl mx-auto">
            Each domain teaches data analysis with Excel, SQL, Power BI, and Python —
            applied to real industry problems.{' '}
            <span className="text-white font-semibold">You can only enroll in one domain at a time.</span>
          </p>
          {enrollment && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You are enrolled — continue your domain below
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map(domain => (
            <DomainCard
              key={domain.id}
              domain={domain}
              enrollment={enrollment}
              onSelect={setSelected}
            />
          ))}
        </div>
      </main>

      {selected && (
        <ConfirmModal
          domain={selected}
          onConfirm={handleEnroll}
          onCancel={() => setSelected(null)}
          loading={enrolling}
        />
      )}
    </div>
  )
}
