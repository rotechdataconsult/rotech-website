'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

export default function ModuleViewerPage() {
  const { id, moduleId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null

  const [course, setCourse]           = useState(null)
  const [module, setModule]           = useState(null)
  const [allModules, setAllModules]   = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [marking, setMarking]         = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!userId || !id || !moduleId) return

    async function load() {
      const [
        { data: courseData },
        { data: moduleData },
        { data: allModulesData },
        { data: progressData },
      ] = await Promise.all([
        supabase.from('courses').select('id, title').eq('id', id).single(),
        supabase.from('modules').select('*').eq('id', moduleId).single(),
        supabase.from('modules').select('id, title, order_index').eq('course_id', id).order('order_index'),
        supabase.from('progress').select('module_id').eq('user_id', userId),
      ])

      setCourse(courseData)
      setModule(moduleData)
      setAllModules(allModulesData ?? [])
      setCompletedIds((progressData ?? []).map((p) => p.module_id))
      setDataLoading(false)
    }

    load()
  }, [userId, id, moduleId])

  async function handleMarkComplete() {
    if (!userId) return
    setMarking(true)
    const { error } = await supabase.from('progress').insert({
      user_id: userId,
      module_id: moduleId,
      completed_at: new Date().toISOString(),
    })
    if (!error) {
      setCompletedIds((prev) => [...prev, moduleId])
      setJustCompleted(true)
    }
    setMarking(false)
  }

  const currentIndex = allModules.findIndex((m) => m.id === moduleId)
  const nextModule   = allModules[currentIndex + 1] ?? null
  const isCompleted  = completedIds.includes(moduleId)
  const isLastModule = currentIndex === allModules.length - 1

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

  if (!module || !course) {
    return (
      <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center">
        <p className="text-[#E8E0F0]">Module not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">

      {/* Navbar */}
      <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-base font-bold tracking-tight">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </Link>
          <Link
            href={`/courses/${id}`}
            className="text-sm text-[#E8E0F0] hover:text-white transition-colors"
          >
            ← Back to {course.title}
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* Module meta */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C8D4E8' }}>
              Module {currentIndex + 1} of {allModules.length}
            </p>
            <h1 className="text-2xl font-extrabold text-white leading-tight">
              {module.title}
            </h1>
          </div>

          {/* Content body */}
          <div
            className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-8 py-8 text-[#E8E0F0] text-base leading-8 tracking-wide max-w-2xl"
            style={{ lineHeight: '1.85' }}
          >
            {module.content_body
              ? module.content_body.split('\n').map((para, i) =>
                  para.trim() ? (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ) : (
                    <br key={i} />
                  )
                )
              : <p className="text-[#C8D4E8]">No content available for this module yet.</p>
            }
          </div>

          {/* Video / external link */}
          {module.content_url && (
            <div className="mt-6 max-w-2xl">
              {module.content_url.includes('youtube.com') || module.content_url.includes('youtu.be') ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-[#9B4FDE]/30">
                  <iframe
                    src={module.content_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={module.title}
                  />
                </div>
              ) : (
                <a
                  href={module.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:text-white hover:border-[#9B4FDE] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Resource
                </a>
              )}
            </div>
          )}

          {/* ── Bottom action bar ── */}
          <div className="mt-10 max-w-2xl">

            {isCompleted ? (
              <div className="flex flex-wrap items-center gap-4">
                {/* Completed badge */}
                <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed ✓
                </span>

                {nextModule && (
                  <Link
                    href={`/courses/${id}/${nextModule.id}`}
                    className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#9B4FDE' }}
                  >
                    Next Module →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success message after marking complete */}
                {justCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Module completed! 🎉
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  {!justCompleted && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={marking}
                      className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity hover:opacity-85"
                      style={{ backgroundColor: '#9B4FDE' }}
                    >
                      {marking ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete ✓
                        </>
                      )}
                    </button>
                  )}

                  {justCompleted && nextModule && (
                    <Link
                      href={`/courses/${id}/${nextModule.id}`}
                      className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-85"
                      style={{ backgroundColor: '#9B4FDE' }}
                    >
                      Next Module →
                    </Link>
                  )}

                  {justCompleted && isLastModule && (
                    <Link
                      href={`/courses/${id}`}
                      className="text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:text-white hover:border-[#9B4FDE] transition-colors"
                    >
                      Back to Course
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── Sidebar — desktop only ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#9B4FDE]/30">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8E0F0]">
                Course Modules
              </p>
            </div>
            <ul className="divide-y divide-[#9B4FDE]/20">
              {allModules.map((m, idx) => {
                const isCurrent   = m.id === moduleId
                const isDone      = completedIds.includes(m.id)
                return (
                  <li key={m.id}>
                    <Link
                      href={`/courses/${id}/${m.id}`}
                      className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-colors ${
                        isCurrent
                          ? 'text-white font-semibold'
                          : 'text-[#E8E0F0] hover:text-white'
                      }`}
                      style={isCurrent ? { backgroundColor: '#9B4FDE22' } : {}}
                    >
                      {/* Number / check */}
                      <span
                        className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? 'bg-green-500/20 text-green-400'
                            : isCurrent
                            ? 'text-white'
                            : 'bg-[#6B28A8] text-[#C8D4E8]'
                        }`}
                        style={isCurrent && !isDone ? { backgroundColor: '#9B4FDE', color: '#fff' } : {}}
                      >
                        {isDone ? (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </span>
                      <span className="leading-snug truncate">{m.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  )
}
