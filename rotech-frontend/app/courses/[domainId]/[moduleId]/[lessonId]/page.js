'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import { LessonTypeBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'

export default function LessonPage() {
  const { domainId, moduleId, lessonId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [lesson,      setLesson]      = useState(null)
  const [allLessons,  setAllLessons]  = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [marking,     setMarking]     = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: lessonData }, { data: allData }, { data: progressData }] = await Promise.all([
        supabase.from('lessons').select('*, modules(title, tool, domain_id)').eq('id', lessonId).single(),
        supabase.from('lessons').select('id, order_index').eq('module_id', moduleId).order('order_index'),
        supabase.from('progress').select('lesson_id').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle(),
      ])
      setLesson(lessonData)
      setAllLessons(allData ?? [])
      setIsCompleted(!!progressData)
      setDataLoading(false)
    }
    load()
  }, [user, lessonId, moduleId])

  async function markComplete() {
    if (isCompleted) return
    setMarking(true)
    await supabase.from('progress').insert({ user_id: user.id, lesson_id: lessonId })
    setIsCompleted(true)
    setMarking(false)
  }

  if (authLoading || dataLoading) return <PageSpinner />

  const currentIndex = allLessons.findIndex(l => l.id === lessonId)
  const prevLesson   = allLessons[currentIndex - 1]
  const nextLesson   = allLessons[currentIndex + 1]

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <Navbar
        profile={profile}
        back={`/courses/${domainId}/${moduleId}`}
        backLabel={lesson?.modules?.title ?? 'Module'}
      />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Lesson header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LessonTypeBadge type={lesson?.lesson_type ?? 'reading'} />
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                Completed
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white">{lesson?.title}</h1>
        </div>

        {/* Lesson content */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8">
          {lesson?.content ? (
            <div
              className="prose prose-invert prose-sm max-w-none text-[#E8E0F0] leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {lesson.content}
            </div>
          ) : (
            <p className="text-[#C8D4E8] text-sm text-center py-10">
              Content is being added by your instructor. Check back soon.
            </p>
          )}
        </div>

        {/* Dataset download */}
        {lesson?.dataset_url && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">&#128190;</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Practice Dataset</p>
              <p className="text-xs text-[#C8D4E8]">Download and follow along</p>
            </div>
            <a
              href={lesson.dataset_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: '#9B4FDE' }}
            >
              Download
            </a>
          </div>
        )}

        {/* Mark complete + navigation */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {prevLesson ? (
            <Link
              href={`/courses/${domainId}/${moduleId}/${prevLesson.id}`}
              className="text-sm font-medium text-[#C8D4E8] hover:text-white transition-colors flex items-center gap-1"
            >
              &#8592; Previous
            </Link>
          ) : <div />}

          {!isCompleted ? (
            <Button onClick={markComplete} disabled={marking} size="md">
              {marking ? 'Saving...' : 'Mark as Complete'}
            </Button>
          ) : (
            <span className="text-sm text-green-400 font-medium">&#10003; Completed</span>
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${domainId}/${moduleId}/${nextLesson.id}`}
              className="text-sm font-medium text-[#C8D4E8] hover:text-white transition-colors flex items-center gap-1"
            >
              Next &#8594;
            </Link>
          ) : (
            <Link
              href={`/courses/${domainId}/${moduleId}`}
              className="text-sm font-medium text-[#9B4FDE] hover:text-white transition-colors"
            >
              Back to Module
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
