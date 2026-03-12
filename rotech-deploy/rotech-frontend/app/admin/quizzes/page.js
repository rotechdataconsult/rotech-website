'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { PASS_MARK } from '@/lib/constants'

const EMPTY_QUIZ = { title: '', time_limit_mins: '15', pass_mark: String(PASS_MARK) }
const EMPTY_Q    = { question: '', optA: '', optB: '', optC: '', optD: '', correct: 'A', explanation: '' }
const LETTERS    = ['A', 'B', 'C', 'D']

export default function AdminQuizzesPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,        setDomains]        = useState([])
  const [modules,        setModules]        = useState([])
  const [questions,      setQuestions]      = useState([])
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [quiz,           setQuiz]           = useState(null)   // existing quiz for module
  const [quizForm,       setQuizForm]       = useState(EMPTY_QUIZ)
  const [qForm,          setQForm]          = useState(EMPTY_Q)
  const [savingQuiz,     setSavingQuiz]     = useState(false)
  const [savingQ,        setSavingQ]        = useState(false)
  const [error,          setError]          = useState('')
  const [success,        setSuccess]        = useState('')
  const [dataLoading,    setDataLoading]    = useState(true)

  useEffect(() => {
    if (!user) return
    if (profile && profile.role !== 'admin') { router.push('/dashboard'); return }
    supabase.from('domains').select('id, title, icon').order('title')
      .then(({ data }) => { setDomains(data ?? []); setDataLoading(false) })
  }, [user, profile, router])

  useEffect(() => {
    setSelectedModule('')
    setModules([])
    setQuiz(null)
    setQuestions([])
    if (!selectedDomain) return
    supabase.from('modules').select('id, title, order_index').eq('domain_id', selectedDomain).order('order_index')
      .then(({ data }) => setModules(data ?? []))
  }, [selectedDomain])

  useEffect(() => {
    setQuiz(null)
    setQuestions([])
    if (!selectedModule) return
    loadQuizData()
  }, [selectedModule])

  async function loadQuizData() {
    const { data: quizData } = await supabase
      .from('quizzes').select('*').eq('module_id', selectedModule).maybeSingle()
    setQuiz(quizData)
    if (quizData) {
      const { data: qData } = await supabase
        .from('quiz_questions').select('*').eq('quiz_id', quizData.id).order('order_index')
      setQuestions(qData ?? [])
    }
  }

  // ── Create quiz ──────────────────────────────────────────────────────────
  async function handleCreateQuiz(e) {
    e.preventDefault()
    if (!selectedModule)          { setError('Select a module first.'); return }
    if (!quizForm.title.trim())   { setError('Quiz title is required.'); return }
    setSavingQuiz(true)
    setError('')
    const { data, error: err } = await supabase.from('quizzes').insert({
      module_id:       selectedModule,
      title:           quizForm.title.trim(),
      time_limit_mins: parseInt(quizForm.time_limit_mins) || 15,
      pass_mark:       parseInt(quizForm.pass_mark) || PASS_MARK,
    }).select().single()
    if (err) {
      setError(err.message)
    } else {
      setQuiz(data)
      setSuccess('Quiz created. Now add questions.')
    }
    setSavingQuiz(false)
  }

  // ── Add question ─────────────────────────────────────────────────────────
  async function handleAddQuestion(e) {
    e.preventDefault()
    if (!quiz)                    { setError('Create the quiz first.'); return }
    if (!qForm.question.trim())   { setError('Question text is required.'); return }
    if (!qForm.optA.trim() || !qForm.optB.trim()) { setError('At least options A and B are required.'); return }
    setError('')
    setSavingQ(true)

    const opts = [qForm.optA, qForm.optB, qForm.optC, qForm.optD].filter(s => s.trim())
    const correctMap = { A: qForm.optA, B: qForm.optB, C: qForm.optC, D: qForm.optD }
    const correctAnswer = correctMap[qForm.correct]?.trim()
    if (!correctAnswer) { setError('Selected correct option is empty.'); setSavingQ(false); return }

    const { error: err } = await supabase.from('quiz_questions').insert({
      quiz_id:        quiz.id,
      question:       qForm.question.trim(),
      options:        opts,
      correct_answer: correctAnswer,
      explanation:    qForm.explanation.trim() || null,
      order_index:    questions.length + 1,
    })
    if (err) {
      setError(err.message)
    } else {
      setSuccess('Question added.')
      setQForm(EMPTY_Q)
      await loadQuizData()
    }
    setSavingQ(false)
  }

  async function handleDeleteQuestion(id) {
    await supabase.from('quiz_questions').delete().eq('id', id)
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Manage Quizzes">

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Domain:</label>
          <select
            value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)}
            className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
          >
            <option value="">Choose domain...</option>
            {domains.map(d => <option key={d.id} value={d.id}>{d.icon} {d.title}</option>)}
          </select>
        </div>
        {selectedDomain && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Module:</label>
            <select
              value={selectedModule} onChange={e => setSelectedModule(e.target.value)}
              className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
            >
              <option value="">Choose module...</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.order_index}. {m.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {error   && <p className="mb-4 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="mb-4 text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

      {selectedModule && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* ── Left column: quiz settings + question form ────────────────── */}
          <div className="space-y-6">

            {/* Create quiz (only if no quiz yet) */}
            {!quiz && (
              <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
                <h2 className="text-sm font-bold text-white mb-5">Create Quiz</h2>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Quiz Title *</label>
                    <input
                      value={quizForm.title}
                      onChange={e => setQuizForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Module 1 Assessment"
                      className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Time (mins)</label>
                      <input
                        type="number" min="5" value={quizForm.time_limit_mins}
                        onChange={e => setQuizForm(p => ({ ...p, time_limit_mins: e.target.value }))}
                        className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Pass Mark (%)</label>
                      <input
                        type="number" min="1" max="100" value={quizForm.pass_mark}
                        onChange={e => setQuizForm(p => ({ ...p, pass_mark: e.target.value }))}
                        className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition"
                      />
                    </div>
                  </div>
                  <Button type="submit" fullWidth disabled={savingQuiz}>
                    {savingQuiz ? 'Creating...' : 'Create Quiz'}
                  </Button>
                </form>
              </div>
            )}

            {/* Quiz info banner */}
            {quiz && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm">
                <p className="font-semibold text-green-400">{quiz.title}</p>
                <p className="text-xs text-[#C8D4E8] mt-0.5">
                  {quiz.time_limit_mins} min &middot; Pass mark: {quiz.pass_mark}% &middot; {questions.length} question{questions.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Add question form */}
            {quiz && (
              <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
                <h2 className="text-sm font-bold text-white mb-5">Add Question</h2>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Question *</label>
                    <textarea
                      value={qForm.question}
                      onChange={e => setQForm(p => ({ ...p, question: e.target.value }))}
                      rows={3} placeholder="Type the question here..."
                      className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#E8E0F0]">Options *</label>
                    {LETTERS.map(letter => (
                      <div key={letter} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#9B4FDE] w-4 shrink-0">{letter}</span>
                        <input
                          value={qForm[`opt${letter}`]}
                          onChange={e => setQForm(p => ({ ...p, [`opt${letter}`]: e.target.value }))}
                          placeholder={`Option ${letter}`}
                          className="flex-1 bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Correct Answer *</label>
                    <select
                      value={qForm.correct}
                      onChange={e => setQForm(p => ({ ...p, correct: e.target.value }))}
                      className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                    >
                      {LETTERS.map(l => <option key={l} value={l}>Option {l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Explanation (optional)</label>
                    <textarea
                      value={qForm.explanation}
                      onChange={e => setQForm(p => ({ ...p, explanation: e.target.value }))}
                      rows={2} placeholder="Why is this the correct answer?"
                      className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-none"
                    />
                  </div>

                  <Button type="submit" fullWidth disabled={savingQ}>
                    {savingQ ? 'Saving...' : 'Add Question'}
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* ── Right column: question list ──────────────────────────────── */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white">
              Questions ({questions.length})
            </h2>
            {questions.length === 0 ? (
              <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
                <p className="text-[#C8D4E8] text-sm">{quiz ? 'No questions yet.' : 'Create the quiz first.'}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {questions.map((q, i) => (
                  <div key={q.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xs font-bold text-[#9B4FDE] shrink-0 mt-0.5">Q{i + 1}</span>
                      <p className="text-sm text-white flex-1">{q.question}</p>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="shrink-0 text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="space-y-1 pl-5">
                      {(q.options ?? []).map((opt, oi) => (
                        <p
                          key={oi}
                          className={`text-xs px-2 py-1 rounded ${
                            opt === q.correct_answer
                              ? 'bg-green-500/15 text-green-400'
                              : 'text-[#C8D4E8]'
                          }`}
                        >
                          {LETTERS[oi]}. {opt}
                          {opt === q.correct_answer && ' ✓'}
                        </p>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-2 pl-5 text-xs text-[#9B4FDE] italic">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedModule && (
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-10 text-center">
          <p className="text-[#C8D4E8] text-sm">Select a domain and module to manage its quiz.</p>
        </div>
      )}
    </AdminLayout>
  )
}
