'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import QuizQuestion from '@/components/lms/QuizQuestion'
import QuizTimer from '@/components/lms/QuizTimer'
import ProgressBar from '@/components/ui/ProgressBar'
import { PASS_MARK } from '@/lib/constants'

const S = { LOADING: 'loading', LOCKED: 'locked', INTRO: 'intro', ACTIVE: 'active', RESULT: 'result', REVIEW: 'review' }
const EXAM_MINS = 30

function generateVerificationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let rand = ''
  for (let i = 0; i < 8; i++) rand += chars[Math.floor(Math.random() * chars.length)]
  return `RTC-${new Date().getFullYear()}-${rand}`
}

export default function FinalExamPage() {
  const { domainId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domain,      setDomain]      = useState(null)
  const [questions,   setQuestions]   = useState([])
  const [pastAttempt, setPastAttempt] = useState(null)
  const [certificate, setCertificate] = useState(null)

  const [stage,   setStage]   = useState(S.LOADING)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [score,   setScore]   = useState(null)
  const [passed,  setPassed]  = useState(false)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    async function load() {
      // Step 1: domain + enrollment
      const [{ data: domainData }, { data: enrollData }] = await Promise.all([
        supabase.from('domains').select('*').eq('id', domainId).single(),
        supabase.from('enrollments').select('id').eq('user_id', user.id).eq('domain_id', domainId).maybeSingle(),
      ])
      if (!enrollData) { router.push('/courses'); return }
      setDomain(domainData)

      // Step 2: modules + existing certificate
      const [{ data: moduleData }, { data: certData }] = await Promise.all([
        supabase.from('modules').select('id').eq('domain_id', domainId),
        supabase.from('certificates').select('*').eq('user_id', user.id).eq('domain_id', domainId).maybeSingle(),
      ])
      setCertificate(certData)

      const moduleIds = (moduleData ?? []).map(m => m.id)
      if (moduleIds.length === 0) { setStage(S.LOCKED); return }

      // Step 3: lesson IDs → progress check
      const { data: lessonData } = await supabase.from('lessons').select('id').in('module_id', moduleIds)
      const lessonIds = (lessonData ?? []).map(l => l.id)
      const totalLessons = lessonIds.length

      const progressQuery = totalLessons > 0
        ? supabase.from('progress').select('*', { count: 'exact', head: true })
            .eq('user_id', user.id).in('lesson_id', lessonIds)
        : Promise.resolve({ count: 0 })

      // Step 4: parallel — progress + exam questions + past attempt
      const [
        { count: doneLessons },
        { data: qData },
        { data: attemptData },
      ] = await Promise.all([
        progressQuery,
        supabase.from('final_exam_questions').select('*').eq('domain_id', domainId).order('order_index'),
        supabase.from('final_exam_attempts')
          .select('*').eq('user_id', user.id).eq('domain_id', domainId)
          .order('attempted_at', { ascending: false }).limit(1).maybeSingle(),
      ])

      if (totalLessons > 0 && (doneLessons ?? 0) < totalLessons) {
        setStage(S.LOCKED)
        return
      }

      setQuestions(qData ?? [])
      setPastAttempt(attemptData)
      setStage(S.INTRO)
    }
    load()
  }, [user, domainId, router])

  // ── Timer expire ──────────────────────────────────────────────────────────
  const handleExpire = useCallback(() => submitExam(answers), [answers])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function handleSelect(option) {
    setAnswers(prev => ({ ...prev, [questions[current].id]: option }))
  }
  function goNext() { if (current < questions.length - 1) setCurrent(c => c + 1) }
  function goPrev() { if (current > 0) setCurrent(c => c - 1) }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submitExam(finalAnswers) {
    if (!questions.length) return
    const correct = questions.filter(q => finalAnswers[q.id] === q.correct_answer).length
    const pct  = Math.round((correct / questions.length) * 100)
    const pass = pct >= PASS_MARK

    setScore(pct)
    setPassed(pass)
    setStage(S.RESULT)

    // Save attempt
    await supabase.from('final_exam_attempts').insert({
      user_id:   user.id,
      domain_id: domainId,
      score:     pct,
      passed:    pass,
      answers:   finalAnswers,
    })

    // Issue certificate on first pass
    if (pass && !certificate) {
      const code = generateVerificationCode()
      const { data: cert } = await supabase
        .from('certificates')
        .insert({ user_id: user.id, domain_id: domainId, verification_code: code, score: pct })
        .select()
        .single()
      if (cert) setCertificate(cert)
    }
  }

  function resetExam() {
    setAnswers({})
    setCurrent(0)
    setScore(null)
    setPassed(false)
    setStage(S.INTRO)
  }

  if (authLoading || stage === S.LOADING) return <PageSpinner />

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      <Navbar
        profile={profile}
        back={`/courses/${domainId}`}
        backLabel={domain?.title ?? 'Domain'}
      />

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* ── LOCKED ──────────────────────────────────────────────────────── */}
        {stage === S.LOCKED && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-10 text-center space-y-4">
            <p className="text-5xl">&#128274;</p>
            <h1 className="text-xl font-extrabold text-white">Final Exam Locked</h1>
            <p className="text-[#E8E0F0] text-sm max-w-xs mx-auto">
              Complete all module lessons and quizzes to unlock the final exam.
            </p>
            <Button onClick={() => router.push(`/courses/${domainId}`)}>
              Back to Modules
            </Button>
          </div>
        )}

        {/* ── INTRO ───────────────────────────────────────────────────────── */}
        {stage === S.INTRO && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 space-y-6 text-center">
            <div>
              <p className="text-4xl mb-3">&#127891;</p>
              <h1 className="text-xl font-extrabold text-white">Final Exam</h1>
              <p className="text-[#E8E0F0] text-sm mt-1">{domain?.title} — Data Analytics Programme</p>
            </div>

            {/* Already certified */}
            {certificate && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-5 space-y-3">
                <p className="text-green-400 font-bold">&#127942; Certificate Earned — Score: {certificate.score}%</p>
                <p className="text-xs text-[#C8D4E8]">
                  Code: <span className="font-mono text-white">{certificate.verification_code}</span>
                </p>
                <Link
                  href={`/courses/${domainId}/certificate`}
                  className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white rounded-lg"
                  style={{ backgroundColor: '#9B4FDE' }}
                >
                  View Certificate &#8594;
                </Link>
              </div>
            )}

            {/* No questions yet */}
            {!certificate && questions.length === 0 && (
              <p className="text-[#C8D4E8] text-sm">
                The final exam is being prepared. Check back soon.
              </p>
            )}

            {/* Ready to take */}
            {!certificate && questions.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Questions', value: questions.length },
                    { label: 'Time Limit', value: `${EXAM_MINS} min` },
                    { label: 'Pass Mark',  value: `${PASS_MARK}%`  },
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

                <div className="bg-[#6B28A8] rounded-xl px-4 py-3 text-xs text-[#C8D4E8] text-left space-y-1">
                  <p className="font-semibold text-white mb-1">Before you begin:</p>
                  <p>&#8226; The timer starts immediately when you click Start.</p>
                  <p>&#8226; You can navigate between questions freely.</p>
                  <p>&#8226; Unanswered questions count as wrong.</p>
                  <p>&#8226; On passing, your certificate is issued instantly.</p>
                </div>

                <Button fullWidth onClick={() => { setAnswers({}); setCurrent(0); setStage(S.ACTIVE) }}>
                  {pastAttempt ? 'Retake Exam' : 'Start Exam'}
                </Button>
              </>
            )}
          </div>
        )}

        {/* ── ACTIVE ──────────────────────────────────────────────────────── */}
        {stage === S.ACTIVE && questions.length > 0 && (
          <div className="space-y-6">
            {/* Header bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <ProgressBar value={answeredCount} max={questions.length} size="sm" showLabel={false} />
                <p className="text-xs text-[#C8D4E8] mt-1">{answeredCount}/{questions.length} answered</p>
              </div>
              <QuizTimer durationMins={EXAM_MINS} onExpire={handleExpire} />
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

              <div className="flex gap-1.5 flex-wrap justify-center flex-1">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === current ? 'scale-125' : answers[q.id] ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ backgroundColor: '#9B4FDE' }}
                  />
                ))}
              </div>

              {current < questions.length - 1 ? (
                <Button onClick={goNext}>Next</Button>
              ) : (
                <Button
                  onClick={() => submitExam(answers)}
                  disabled={answeredCount < questions.length}
                >
                  Submit Exam
                </Button>
              )}
            </div>

            {answeredCount < questions.length && current === questions.length - 1 && (
              <p className="text-xs text-yellow-400 text-center">
                {questions.length - answeredCount} question
                {questions.length - answeredCount !== 1 ? 's' : ''} unanswered
              </p>
            )}
          </div>
        )}

        {/* ── RESULT ──────────────────────────────────────────────────────── */}
        {stage === S.RESULT && (
          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 space-y-6 text-center">
            {/* Score circle */}
            <div className="relative w-36 h-36 mx-auto">
              <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={passed ? '#22c55e' : '#ef4444'}
                  strokeWidth="2.5"
                  strokeDasharray={`${score} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{score}%</span>
                <span className="text-xs text-[#C8D4E8]">{passed ? 'Passed' : 'Failed'}</span>
              </div>
            </div>

            <div>
              <p className={`text-2xl font-extrabold mb-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {passed ? '&#127942; Exam Passed!' : 'Not Quite'}
              </p>
              <p className="text-[#E8E0F0] text-sm">
                {passed
                  ? 'Outstanding! Your certificate has been issued.'
                  : `You need ${PASS_MARK}% to pass. You scored ${score}%. Keep going!`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={resetExam}>Retake Exam</Button>
              {passed && certificate && (
                <Link
                  href={`/courses/${domainId}/certificate`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg"
                  style={{ backgroundColor: '#9B4FDE' }}
                >
                  View Certificate &#8594;
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-[#9B4FDE]/20">
              <Button fullWidth variant="ghost" onClick={() => { setCurrent(0); setStage(S.REVIEW) }}>
                Review Answers &amp; Explanations
              </Button>
            </div>
          </div>
        )}

        {/* ── REVIEW ──────────────────────────────────────────────────────── */}
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
