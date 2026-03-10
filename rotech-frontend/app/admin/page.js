'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'

const SECTIONS = [
  { href: '/admin/domains',  title: 'Domains',       desc: 'Create and configure learning domains' },
  { href: '/admin/modules',  title: 'Modules',       desc: 'Add modules to domains' },
  { href: '/admin/lessons',  title: 'Lessons',       desc: 'Upload lesson content' },
  { href: '/admin/quizzes',  title: 'Quizzes',       desc: 'Build module quiz questions' },
  { href: '/admin/exam',     title: 'Final Exam',    desc: 'Build domain final exam questions' },
  { href: '/admin/youtube',  title: 'YouTube',       desc: 'Manage video resources' },
  { href: '/admin/students', title: 'Students',      desc: 'Track progress & certificates' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user) return
    if (profile && profile.role !== 'admin') { router.push('/dashboard'); return }
    async function load() {
      const [
        { count: students },
        { count: enrollments },
        { count: certificates },
        { count: domains },
        { count: modules },
        { count: lessons },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('domains').select('*', { count: 'exact', head: true }),
        supabase.from('modules').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
      ])
      setStats({ students, enrollments, certificates, domains, modules, lessons })
    }
    load()
  }, [user, profile, router])

  if (authLoading || !stats) return <PageSpinner />

  const STAT_CARDS = [
    { label: 'Students',     value: stats.students,     href: '/admin/students' },
    { label: 'Enrollments',  value: stats.enrollments,  href: '/admin/students' },
    { label: 'Certificates', value: stats.certificates, href: '/admin/students' },
    { label: 'Domains',      value: stats.domains,      href: '/admin/domains'  },
    { label: 'Modules',      value: stats.modules,      href: '/admin/modules'  },
    { label: 'Lessons',      value: stats.lessons,      href: '/admin/lessons'  },
  ]

  return (
    <AdminLayout profile={profile} title="Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {STAT_CARDS.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-5 text-center hover:border-[#9B4FDE]/60 transition-colors"
          >
            <p className="text-3xl font-extrabold" style={{ color: '#9B4FDE' }}>{value ?? 0}</p>
            <p className="text-xs text-[#E8E0F0] mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <h2 className="text-xs font-semibold text-[#C8D4E8] uppercase tracking-widest mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTIONS.map(({ href, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-5 hover:border-[#9B4FDE]/60 transition-colors group"
          >
            <p className="font-semibold text-white text-sm">{title}</p>
            <p className="text-xs text-[#C8D4E8] mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  )
}
