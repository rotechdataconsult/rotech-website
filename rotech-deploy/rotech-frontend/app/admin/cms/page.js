'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'

const CMS_SECTIONS = [
  {
    href:  '/admin/cms/hero',
    icon:  '🦸',
    title: 'Hero Section',
    desc:  'Edit headline, sub-headline, badge text, and CTA buttons.',
    color: '#6C3FD4',
  },
  {
    href:  '/admin/cms/impact',
    icon:  '📊',
    title: 'Impact Metrics',
    desc:  'Update the 4 animated stat cards (students, businesses, courses, countries).',
    color: '#0EA5E9',
  },
  {
    href:  '/admin/cms/programs',
    icon:  '📚',
    title: 'Learning Programs',
    desc:  'Add, edit, reorder, or hide course cards on the landing page.',
    color: '#10B981',
  },
  {
    href:  '/admin/cms/testimonials',
    icon:  '💬',
    title: 'Testimonials',
    desc:  'Manage student success stories shown in the testimonials carousel.',
    color: '#F59E0B',
  },
  {
    href:  '/admin/cms/team',
    icon:  '👥',
    title: 'Team Members',
    desc:  'Add and manage staff profiles shown in the team section.',
    color: '#BE185D',
  },
]

export default function CMSDashboard() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && profile && profile.role !== 'admin') router.push('/dashboard')
  }, [user, profile, loading, router])

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Landing Page CMS">
      <div className="max-w-4xl">

        <div className="mb-8 p-5 rounded-xl border" style={{ backgroundColor: 'rgba(108,63,212,0.1)', borderColor: 'rgba(139,92,246,0.25)' }}>
          <p className="text-sm font-semibold text-white mb-1">How it works</p>
          <p className="text-xs" style={{ color: '#C8D4E8' }}>
            Edit any section below and save. The landing page automatically updates within 5 minutes,
            or instantly if you click <strong className="text-white">Publish Changes</strong> inside each editor.
            All sections fall back to built-in defaults if left empty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CMS_SECTIONS.map(({ href, icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl p-5 border transition-all hover:border-[#9B4FDE]/60 hover:-translate-y-0.5 hover:shadow-lg group"
              style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: color + '25' }}>
                  {icon}
                </div>
                <p className="font-semibold text-white text-sm">{title}</p>
              </div>
              <p className="text-xs" style={{ color: '#C8D4E8' }}>{desc}</p>
              <p className="text-xs font-semibold mt-3 transition-colors group-hover:text-white" style={{ color: '#9B4FDE' }}>
                Edit →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(155,79,222,0.2)' }}>
          <p className="text-xs" style={{ color: '#9B4FDE' }}>
            💡 <strong className="text-white">Tip:</strong> Use the AI Assistant (available inside each editor) to generate headlines, course descriptions, and testimonials in seconds.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
