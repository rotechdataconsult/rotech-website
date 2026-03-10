'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import QuizQuestion from '@/components/lms/QuizQuestion'
import QuizTimer from '@/components/lms/QuizTimer'
import QuizResult from '@/components/lms/QuizResult'
import ProgressBar from '@/components/ui/ProgressBar'
import { PASS_MARK } from '@/lib/constants'

// ── States ────────────────────────────────────────────────────────────────────
const S = { LOADING: 'loading', INTRO: 'intro', ACTIVE: 'active', REVIEW: 'review', RESULT: 'result' }

export default function QuizPage() {
  const { domainId, moduleId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [quiz,       setQuiz]       = useState(null)
  const [questions,  setQuestions]  = useState([])
  const [module,     setModule]     = useState(null)
  const [nextModule, setNextModule] = useState(null)
  const [pastAttempt,setPastAttempt]= useState(null)

  const [stage,      setStage]      = useState(S.LOADING)
  const [current,    setCurrent]    = useState(0)
  const [answers,    setAnswers]    = useState({})   // questionId → selected option
  const [score,      setScore]      = useState(null)
  const [passed,     setPassed]     = useState(false)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: modData }, { data: quizData }] = await Promise.all([
        supabase.from('modules').select('*, domains(title)').eq('id', moduleId).single(),
        supabase.from('quizzes').select('*').eq('module_id', moduleId).maybeSingle(),
      ])

      setModule(modData)

      if (!quizData) { setStage(S.INTRO); return }

      const [{ data: qData }, { data: attemptData }, { data: allMods }] = await Promise.all([
        supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id).order('order_index'),
        supabase.from('quiz_attempts')
          .select('*').eq('user_id', user.id).eq('quiz_id', quizData.id)
          .order('attempted_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('modules').select('id, order_index').eq('domain_id', domainId).order('order_index'),
      ])

      setQuiz(quizData)
      setQuestions(qData ?? [])
      setPastAttempt(attemptData)

      // Find next module
      if (allMods) {
        const idx = allMods.findIndex(m => m.id === moduleId)
        if (idx !== -1 && allMods[idx + 1]) setNextModule(allMods[idx + 1])
      }

      setStage(S.INTRO)
    }
    load()
  }, [user, moduleId, domainId])

  // ── Timer expire ─────────────────────────────────────────────────────────
  const handleExpire = useCallback(() => submitQuiz(answers), [answers])

  // ── Select answer ─────────────────────────────────────────────────────────
  function handleSelect(option) {
    setAnswers(prev => ({ ...prev, [questions[current].id]: option }))
  }

  // ── Navigate questions ────────────────────────────────────────────────────
  function goNext() {
    if (current < questions.length - 1) setCurrent(c => c + 1)
  }
  function goPrev() {
    if (current > 0) setCurrent(c => c - 1)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submitQuiz(finalAnswers) {
    if (!quiz) return
    const correct = questions.filter(q => finalAnswers[q.id] === q.correct_answer).length
    const pct     = Math.round((correct / questions.length) * 100)
    const pass    = pct >= (quiz.pass_mark ?? PASS_MARK)

    setScore(correct)
    setPassed(pass)
    setStage(S.RESULT)

    await supabase.from('quiz_attempts').insert({
      user_id:  user.id,
      quiz_id:  quiz.id,
      score:    pct,
      passed:   pass,
      answers:  finalAnswers,
    })
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetQuiz() {
    setAnswers({})
    setCurrent(0)
    setScore(null)
    setPassed(false)
    setStage(S.INTRO)
  }

  // ── Review mode ───────────────────────────────────────────────────────────
  function startReview() {
    setCurrent(0)
    setStage(S.REVIEW)
  }

  if (authLoading || stage === S.LOADING) return <PageSpinner />

  const answeredCount = Object.keys(answers).length
  const nextHref = nextModule
    ? `/courses/${domainId}/${nextModule.id}`
    : `/courses/${domainId}`

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <Navbar
        profile={profile}
        back={`/courses/${domainId}/${moduleId}`}
        backLabel={module?.title ?? 'Module'}
      />

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* ── INTRO ─────────────────────────────────────────────────────── */}
        {stage === S.INTRO && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 space-y-6 text-center">
            <div>
              <p className="text-4xl mb-3">&#9997;&#65039;</p>
              <h1 className="text-xl font-extrabold text-white">
                {quiz ? quiz.title : 'Module Quiz'}
              </h1>
              <p className="text-[#E8E0F0] text-sm mt-1">{module?.title}</p>
            </div>

            {!quiz ? (
              <p className="text-[#C8D4E8] text-sm">
                The quiz for this module is being prepared. Check back soon.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Questions',   value: questions.length },
                    { label: 'Time Limit',  value: `${quiz.time_limit_mins ?? 15} min` },
                    { label: 'Pass Mark',   value: `${quiz.pass_mark ?? PASS_MARK}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#6B28A8] rounded-xl px-3 py-4">
                      <p className="text-lg font-extrabold" style={{ color: '#9B4FDE' }}>{value}</p>
                      <p className="text-xs text-[#E8E0F0] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {pastAttempt && (
                  <div className={`rounded-xl px-4 py-3 text-sm border ${
                    pastAttempt.passed
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  }`}>
                    Last attempt: <strong>{pastAttempt.score}%</strong> —{' '}
                    {pastAttempt.passed ? 'Passed' : 'Failed'}
                  </div>
                )}

                <div className="space-y-3">
                  <Button fullWidth onClick={() => { setAnswers({}); setCurrent(0); setStage(S.ACTIVE) }}>
                    {pastAttempt ? 'Retake Quiz' : 'Start Quiz'}
                  </Button>
                  {pastAttempt && (
                    <Button fullWidth variant="outline" onClick={startReview}>
                      Review Last Attempt
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ACTIVE ────────────────────────────────────────────────────── */}
        {stage === S.ACTIVE && questions.length > 0 && (
          <div className="space-y-6">

            {/* Header bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <ProgressBar value={answeredCount} max={questions.length} size="sm" showLabel={false} />
                <p className="text-xs text-[#C8D4E8] mt-1">{answeredCount}/{questions.length} answered</p>
              </div>
              <QuizTimer durationMins={quiz?.time_limit_mins ?? 15} onExpire={handleExpire} />
            </div>

            {/* Question card */}
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-6">
              <QuizQuestion
                question={questions[current].question}
                options={questions[current].options}
                selected={answers[questions[current].id]}
                onSelect={handleSelect}
                revealed={false}
                index={current}
                total={questions.length}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={goPrev} disabled={current === 0}>
                Previous
              </Button>

              {/* Dot indicators */}
              <div className="flex gap-1.5 flex-wrap justify-center flex-1">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === current
                        ? 'scale-125'
                        : answers[q.id]
                        ? 'opacity-100'
                        : 'opacity-30'
                    }`}
                    style={{ backgroundColor: '#9B4FDE' }}
                  />
                ))}
              </div>

              {current < questions.length - 1 ? (
                <Button onClick={goNext}>Next</Button>
              ) : (
                <Button
                  onClick={() => submitQuiz(answers)}
                  disabled={answeredCount < questions.length}
                >
                  Submit Quiz
                </Button>
              )}
            </div>

            {answeredCount < questions.length && current === questions.length - 1 && (
              <p className="text-xs text-yellow-400 text-center">
                {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} unanswered
              </p>
            )}
          </div>
        )}

        {/* ── RESULT ────────────────────────────────────────────────────── */}
        {stage === S.RESULT && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 space-y-6">
            <QuizResult
              score={score}
              total={questions.length}
              passed={passed}
              onRetry={resetQuiz}
              nextHref={nextHref}
              moduleTitle={module?.title}
            />
            <div className="pt-2 border-t border-[#9B4FDE]/20">
              <Button fullWidth variant="ghost" onClick={startReview}>
                Review Answers & Explanations
              </Button>
            </div>
          </div>
        )}

        {/* ── REVIEW ────────────────────────────────────────────────────── */}
        {stage === S.REVIEW && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Answer Review</h2>
              <Button variant="outline" size="sm" onClick={() => setStage(S.RESULT)}>
                Back to Results
              </Button>
            </div>

            {questions.map((q, i) => (
              <div key={q.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-6">
                <QuizQuestion
                  question={q.question}
                  options={q.options}
                  selected={answers[q.id]}
                  onSelect={() => {}}
                  revealed={true}
                  correctAnswer={q.correct_answer}
                  explanation={q.explanation}
                  index={i}
                  total={questions.length}
                />
              </div>
            ))}

            <Button fullWidth onClick={() => setStage(S.RESULT)}>
              Back to Results
            </Button>
          </div>
        )}

      </main>
    </div>
  )
}
