'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import ProgressBar from '@/components/ui/ProgressBar'
import ModuleCard from '@/components/lms/ModuleCard'
import Navbar from '@/components/layout/Navbar'

export default function DomainPage() {
  const { domainId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domain,      setDomain]      = useState(null)
  const [modules,     setModules]     = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [totalDone,   setTotalDone]   = useState(0)
  const [totalAll,    setTotalAll]    = useState(0)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: domainData }, { data: enrollData }, { data: moduleData }] = await Promise.all([
        supabase.from('domains').select('*').eq('id', domainId).single(),
        supabase.from('enrollments').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('modules').select('*').eq('domain_id', domainId).order('order_index'),
      ])

      if (!enrollData || enrollData.domain_id !== domainId) {
        router.push('/courses')
        return
      }

      setDomain(domainData)
      setModules(moduleData ?? [])

      if (!moduleData?.length) { setDataLoading(false); return }

      const { data: lessonData } = await supabase
        .from('lessons').select('id, module_id')
        .in('module_id', moduleData.map(m => m.id))

      const { data: progressData } = await supabase
        .from('progress').select('lesson_id').eq('user_id', user.id)

      const completedIds = new Set((progressData ?? []).map(p => p.lesson_id))
      const map = {}
      for (const mod of moduleData) {
        const lessons = (lessonData ?? []).filter(l => l.module_id === mod.id)
        map[mod.id] = {
          completed: lessons.filter(l => completedIds.has(l.id)).length,
          total: lessons.length,
        }
      }

      setProgressMap(map)
      setTotalDone(Object.values(map).reduce((s, v) => s + v.completed, 0))
      setTotalAll(Object.values(map).reduce((s, v) => s + v.total, 0))
      setDataLoading(false)
    }
    load()
  }, [user, domainId, router])

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <Navbar profile={profile} back="/courses" backLabel="All Domains" />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Domain header */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{domain?.icon}</span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{domain?.title}</h1>
              <p className="text-[#E8E0F0] text-sm mt-1 max-w-2xl">{domain?.description}</p>
            </div>
          </div>
          <ProgressBar value={totalDone} max={totalAll || 1} />
        </div>

        {/* Modules */}
        <section>
          <h2 className="text-lg font-bold text-white mb-5">Modules</h2>
          {modules.length === 0 ? (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-10 text-center">
              <p className="text-[#C8D4E8] text-sm">Modules are being prepared. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((mod, i) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  domainId={domainId}
                  index={i}
                  completedLessons={progressMap[mod.id]?.completed ?? 0}
                  totalLessons={progressMap[mod.id]?.total ?? 0}
                />
              ))}
            </div>
          )}
        </section>

        {/* Final exam CTA */}
        {totalAll > 0 && totalDone === totalAll && (
          <div className="bg-[#7B2FBE] border border-yellow-500/30 rounded-xl p-6 flex items-center gap-4">
            <span className="text-3xl">&#127891;</span>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">Ready for the Final Exam!</h2>
              <p className="text-xs text-[#E8E0F0] mt-0.5">Pass with 70%+ to earn your certificate.</p>
            </div>
            <Link
              href={`/courses/${domainId}/exam`}
              className="shrink-0 text-sm font-semibold px-5 py-2.5 rounded-lg text-white"
              style={{ backgroundColor: '#9B4FDE' }}
            >
              Take Exam
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
