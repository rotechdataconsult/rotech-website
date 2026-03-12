'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id ?? null

  const [course, setCourse]       = useState(null)
  const [modules, setModules]     = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [enrolled, setEnrolled]   = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!userId || !id) return

    async function load() {
      const [
        { data: courseData },
        { data: moduleData },
        { data: progressData },
        { data: enrollData },
      ] = await Promise.all([
        supabase.from('courses').select('*').eq('id', id).single(),
        supabase.from('modules').select('*').eq('course_id', id).order('order_index'),
        supabase.from('progress').select('module_id').eq('user_id', userId),
        supabase.from('enrollments').select('id').eq('user_id', userId).eq('course_id', id).maybeSingle(),
      ])

      setCourse(courseData)
      setModules(moduleData ?? [])
      setCompletedIds((progressData ?? []).map((p) => p.module_id))
      setEnrolled(!!enrollData)
      setDataLoading(false)
    }

    load()
  }, [userId, id])

  async function handleEnroll() {
    if (!userId) return
    setEnrolling(true)
    const { error } = await supabase.from('enrollments').insert({
      user_id: userId,
      course_id: id,
    })
    if (!error) setEnrolled(true)
    setEnrolling(false)
  }

  const completedCount = modules.filter((m) => completedIds.includes(m.id)).length
  const totalModules   = modules.length
  const progressPct    = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

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

  if (!course) {
    return (
      <div className="min-h-screen bg-[#5a1f9a] flex items-center justify-center">
        <p className="text-[#E8E0F0]">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">

      {/* Navbar */}
      <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </Link>
          <Link href="/courses" className="text-sm text-[#E8E0F0] hover:text-white transition-colors">
            ← All Courses
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Course header */}
        <div>
          <h1 className="text-2xl font-extrabold text-white">{course.title}</h1>
          <p className="mt-2 text-[#E8E0F0] text-sm leading-relaxed">{course.description}</p>
        </div>

        {/* Not enrolled banner */}
        {!enrolled && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-yellow-300 text-sm">
              You need to enroll in this course to access the modules.
            </p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="shrink-0 text-sm font-semibold px-5 py-2 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: '#9B4FDE' }}
            >
              {enrolling ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enrolling...
                </>
              ) : 'Enroll Now'}
            </button>
          </div>
        )}

        {/* Progress bar */}
        {enrolled && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#E8E0F0]">Your Progress</span>
              <span className="text-sm font-bold" style={{ color: '#9B4FDE' }}>
                {completedCount} / {totalModules} modules &nbsp;·&nbsp; {progressPct}%
              </span>
            </div>
            <div className="h-2 bg-[#6B28A8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, backgroundColor: '#9B4FDE' }}
              />
            </div>
          </div>
        )}

        {/* Module list */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Course Modules</h2>

          {modules.map((mod, idx) => {
            const done = completedIds.includes(mod.id)
            return (
              <div
                key={mod.id}
                className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 border transition-colors ${
                  done
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-[#7B2FBE] border-[#9B4FDE]/30'
                }`}
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Number / checkmark */}
                  <div
                    className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      done
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-[#6B28A8] text-[#E8E0F0]'
                    }`}
                  >
                    {done ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Title */}
                  <span className={`text-sm font-medium truncate ${done ? 'text-green-300' : 'text-white'}`}>
                    {mod.title}
                  </span>
                </div>

                {/* Right — action button */}
                {enrolled ? (
                  <Link
                    href={`/courses/${id}/${mod.id}`}
                    className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-lg border transition-colors ${
                      done
                        ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        : 'text-white border-transparent hover:opacity-85'
                    }`}
                    style={done ? {} : { backgroundColor: '#9B4FDE' }}
                  >
                    {done ? 'Review' : 'Start'}
                  </Link>
                ) : (
                  <span className="shrink-0 text-xs text-[#C8D4E8] font-medium">Locked</span>
                )}
              </div>
            )
          })}

          {modules.length === 0 && (
            <p className="text-[#C8D4E8] text-sm text-center py-10">
              No modules available for this course yet.
            </p>
          )}
        </div>

      </main>
    </div>
  )
}
