'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    submitted: 0,
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const [
        { count: enrolled },
        { count: completed },
        { count: submitted },
        { data: enrollments },
      ] = await Promise.all([
        supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('enrollments')
          .select('course_id, enrolled_at, courses(id, title, domain)')
          .eq('user_id', user.id)
          .order('enrolled_at', { ascending: false })
          .limit(3),
      ])

      setStats({
        enrolled: enrolled ?? 0,
        completed: completed ?? 0,
        submitted: submitted ?? 0,
      })
      setRecentCourses(enrollments ?? [])
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
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8"
            style={{ color: '#9B4FDE' }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-[#E8E0F0] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Courses Enrolled',       value: stats.enrolled },
    { label: 'Modules Completed',      value: stats.completed },
    { label: 'Assignments Submitted',  value: stats.submitted },
    { label: 'Days Active',            value: 1 },
  ]

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">

      {/* Navbar */}
      <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#E8E0F0] font-medium">
              {profile?.full_name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:border-[#9B4FDE] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, <span style={{ color: '#C8D4E8' }}>{profile?.full_name}</span>!
          </h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">
            Your domain track:{' '}
            <span className="text-white font-medium">{profile?.domain_track}</span>
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(({ label, value }) => (
            <div key={label} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-5 py-5">
              <p className="text-3xl font-extrabold" style={{ color: '#9B4FDE' }}>
                {value}
              </p>
              <p className="mt-1 text-sm text-[#E8E0F0]">{label}</p>
            </div>
          ))}
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* My Courses */}
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">My Courses</h2>
              <Link
                href="/courses"
                className="text-xs font-medium transition-colors"
                style={{ color: '#C8D4E8' }}
              >
                Browse all →
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <>
                <p className="text-sm text-[#C8D4E8] mb-5">
                  You are not enrolled in any courses yet.
                </p>
                <Link
                  href="/courses"
                  className="inline-block text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: '#9B4FDE' }}
                >
                  Browse Courses
                </Link>
              </>
            ) : (
              <ul className="space-y-3">
                {recentCourses.map((enrollment) => {
                  const course = enrollment.courses
                  return (
                    <li
                      key={enrollment.course_id}
                      className="flex items-center justify-between gap-3 bg-[#6B28A8] rounded-lg px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {course?.title}
                        </p>
                        {course?.domain && (
                          <span className="text-xs text-[#E8E0F0]">{course.domain}</span>
                        )}
                      </div>
                      <Link
                        href={`/courses/${enrollment.course_id}`}
                        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-85"
                        style={{ backgroundColor: '#9B4FDE' }}
                      >
                        Continue
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Continue Learning */}
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Continue Learning</h2>
            <p className="text-sm text-[#C8D4E8]">
              Complete your first module to see progress here.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
