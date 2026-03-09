'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

const LEVEL_BADGE = {
  beginner:     'bg-green-500/15 text-green-400 border border-green-500/30',
  intermediate: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  advanced:     'bg-red-500/15 text-red-400 border border-red-500/30',
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#6B28A8] border border-green-500/40 text-green-400 text-sm px-5 py-3 rounded-xl shadow-2xl animate-fade-in">
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  )
}

function CourseCard({ course, enrolled, onEnroll, enrolling }) {
  const isEnrolling = enrolling === course.id

  return (
    <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-5 flex flex-col gap-4 hover:border-[#9B4FDE]/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug">{course.title}</h3>
        {course.level && (
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEVEL_BADGE[course.level] ?? LEVEL_BADGE.beginner}`}>
            {course.level}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[#E8E0F0] text-sm leading-relaxed flex-1 line-clamp-3">
        {course.description}
      </p>

      {/* Domain tag */}
      {course.domain && (
        <span className="self-start text-xs px-2.5 py-1 rounded-full bg-[#6B28A8] border border-[#9B4FDE]/40 text-[#E8E0F0]">
          {course.domain}
        </span>
      )}

      {/* Action */}
      {enrolled ? (
        <Link
          href={`/courses/${course.id}`}
          className="w-full text-center text-sm font-semibold py-2 rounded-lg border transition-colors"
          style={{ color: '#9B4FDE', borderColor: '#9B4FDE44' }}
        >
          Continue Learning →
        </Link>
      ) : (
        <button
          onClick={() => onEnroll(course)}
          disabled={isEnrolling}
          className="w-full text-sm font-semibold py-2 rounded-lg text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: '#9B4FDE' }}
        >
          {isEnrolling ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enrolling...
            </>
          ) : 'Enroll Now'}
        </button>
      )}
    </div>
  )
}

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth()

  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [enrolling, setEnrolling] = useState(null)
  const [toast, setToast] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const [{ data: courseData }, { data: enrollData }] = await Promise.all([
        supabase.from('courses').select('*').order('order_index'),
        supabase.from('enrollments').select('course_id').eq('user_id', user.id),
      ])

      setCourses(courseData ?? [])
      setEnrolledIds(new Set((enrollData ?? []).map((e) => e.course_id)))
      setDataLoading(false)
    }

    load()
  }, [user])

  async function handleEnroll(course) {
    setEnrolling(course.id)
    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: course.id,
    })
    if (!error) {
      setEnrolledIds((prev) => new Set([...prev, course.id]))
      setToast(`You have been enrolled in ${course.title}`)
    }
    setEnrolling(null)
  }

  const foundation      = courses.filter((c) => c.domain === 'foundation')
  const specializations = courses.filter((c) => c.domain !== 'foundation')

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

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">

      {/* Navbar */}
      <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-[#E8E0F0] hover:text-white transition-colors">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-14">

        {/* Section 1 — Foundation */}
        {foundation.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Foundation Skills</h2>
              <p className="mt-1 text-[#E8E0F0] text-sm">
                Master these tools before choosing your specialization
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {foundation.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={enrolledIds.has(course.id)}
                  onEnroll={handleEnroll}
                  enrolling={enrolling}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 2 — Specializations */}
        {specializations.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Choose Your Domain</h2>
              <p className="mt-1 text-[#E8E0F0] text-sm">
                Specialize in one industry track
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {specializations.map((course) => (
                <div
                  key={course.id}
                  className="ring-1 rounded-xl"
                  style={{ '--tw-ring-color': '#9B4FDE22', ringColor: '#9B4FDE22' }}
                >
                  <CourseCard
                    course={course}
                    enrolled={enrolledIds.has(course.id)}
                    onEnroll={handleEnroll}
                    enrolling={enrolling}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {courses.length === 0 && (
          <p className="text-[#C8D4E8] text-sm text-center py-20">
            No courses available yet. Check back soon.
          </p>
        )}

      </main>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
