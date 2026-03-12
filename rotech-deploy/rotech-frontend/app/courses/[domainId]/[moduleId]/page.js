'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import ProgressBar from '@/components/ui/ProgressBar'
import LessonItem from '@/components/lms/LessonItem'
import { ToolBadge } from '@/components/ui/Badge'
import Navbar from '@/components/layout/Navbar'

export default function ModulePage() {
  const { domainId, moduleId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [module,      setModule]      = useState(null)
  const [lessons,     setLessons]     = useState([])
  const [completedIds,setCompletedIds]= useState(new Set())
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: modData }, { data: lessonData }, { data: progressData }] = await Promise.all([
        supabase.from('modules').select('*, domains(title, icon)').eq('id', moduleId).single(),
        supabase.from('lessons').select('*').eq('module_id', moduleId).order('order_index'),
        supabase.from('progress').select('lesson_id').eq('user_id', user.id),
      ])

      setModule(modData)
      setLessons(lessonData ?? [])
      setCompletedIds(new Set((progressData ?? []).map(p => p.lesson_id)))
      setDataLoading(false)
    }
    load()
  }, [user, moduleId])

  if (authLoading || dataLoading) return <PageSpinner />

  const completedCount = lessons.filter(l => completedIds.has(l.id)).length

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <Navbar
        profile={profile}
        back={`/courses/${domainId}`}
        backLabel={module?.domains?.title ?? 'Domain'}
      />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Module header */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs text-[#C8D4E8] mb-1">{module?.domains?.icon} {module?.domains?.title}</p>
              <h1 className="text-xl font-extrabold text-white">{module?.title}</h1>
              {module?.description && (
                <p className="text-[#E8E0F0] text-sm mt-2">{module.description}</p>
              )}
            </div>
            {module?.tool && <ToolBadge tool={module.tool} />}
          </div>
          <ProgressBar value={completedCount} max={lessons.length || 1} />
        </div>

        {/* Lessons list */}
        <section>
          <h2 className="text-base font-bold text-white mb-4">
            Lessons <span className="text-[#9B4FDE] font-normal text-sm">({completedCount}/{lessons.length} completed)</span>
          </h2>

          {lessons.length === 0 ? (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">Lessons are being added. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  moduleId={moduleId}
                  domainId={domainId}
                  isCompleted={completedIds.has(lesson.id)}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        {/* Module quiz CTA */}
        {lessons.length > 0 && completedCount === lessons.length && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-xl p-5 flex items-center gap-4">
            <span className="text-2xl">&#9997;&#65039;</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Module Complete! Take the Quiz</h3>
              <p className="text-xs text-[#E8E0F0] mt-0.5">Test your knowledge before moving on.</p>
            </div>
            <a
              href={`/courses/${domainId}/${moduleId}/quiz`}
              className="shrink-0 text-sm font-semibold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#9B4FDE' }}
            >
              Start Quiz
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
