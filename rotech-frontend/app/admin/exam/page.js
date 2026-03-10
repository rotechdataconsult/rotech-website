'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'

const LETTERS = ['A', 'B', 'C', 'D']
const EMPTY_Q = { question: '', optA: '', optB: '', optC: '', optD: '', correct: 'A', explanation: '' }

export default function AdminExamPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,        setDomains]        = useState([])
  const [questions,      setQuestions]      = useState([])
  const [selectedDomain, setSelectedDomain] = useState('')
  const [qForm,          setQForm]          = useState(EMPTY_Q)
  const [saving,         setSaving]         = useState(false)
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
    setQuestions([])
    if (!selectedDomain) return
    loadQuestions()
  }, [selectedDomain])

  async function loadQuestions() {
    const { data } = await supabase
      .from('final_exam_questions').select('*').eq('domain_id', selectedDomain).order('order_index')
    setQuestions(data ?? [])
  }

  async function handleAddQuestion(e) {
    e.preventDefault()
    if (!selectedDomain)         { setError('Select a domain first.'); return }
    if (!qForm.question.trim())  { setError('Question text is required.'); return }
    if (!qForm.optA.trim() || !qForm.optB.trim()) { setError('At least options A and B are required.'); return }
    setError('')
    setSaving(true)

    const opts = [qForm.optA, qForm.optB, qForm.optC, qForm.optD].filter(s => s.trim())
    const correctMap = { A: qForm.optA, B: qForm.optB, C: qForm.optC, D: qForm.optD }
    const correctAnswer = correctMap[qForm.correct]?.trim()
    if (!correctAnswer) { setError('Selected correct option is empty.'); setSaving(false); return }

    const { error: err } = await supabase.from('final_exam_questions').insert({
      domain_id:      selectedDomain,
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
      await loadQuestions()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    await supabase.from('final_exam_questions').delete().eq('id', id)
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Final Exam Questions">

      {/* Domain selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Domain:</label>
        <select
          value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)}
          className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
        >
          <option value="">Choose domain...</option>
          {domains.map(d => <option key={d.id} value={d.id}>{d.icon} {d.title}</option>)}
        </select>
        {selectedDomain && (
          <span className="text-xs text-[#C8D4E8]">{questions.length} question{questions.length !== 1 ? 's' : ''} total</span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Question form ────────────────────────────────────────────────── */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white mb-5">Add Exam Question</h2>
          <form onSubmit={handleAddQuestion} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Question *</label>
              <textarea
                value={qForm.question}
                onChange={e => setQForm(p => ({ ...p, question: e.target.value }))}
                rows={3} placeholder="Type the exam question here..."
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

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

            <Button type="submit" fullWidth disabled={saving || !selectedDomain}>
              {saving ? 'Saving...' : 'Add Question'}
            </Button>
          </form>
        </div>

        {/* ── Question list ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">
            {selectedDomain ? `Exam Questions (${questions.length})` : 'Select a domain'}
          </h2>
          {questions.length === 0 && selectedDomain && (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">No questions yet. Add the first one.</p>
            </div>
          )}
          {!selectedDomain && (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">Select a domain to manage its final exam.</p>
            </div>
          )}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xs font-bold text-[#9B4FDE] shrink-0 mt-0.5">Q{i + 1}</span>
                  <p className="text-sm text-white flex-1">{q.question}</p>
                  <button
                    onClick={() => handleDelete(q.id)}
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
                      {opt === q.correct_answer && ' \u2713'}
                    </p>
                  ))}
                </div>
                {q.explanation && (
                  <p className="mt-2 pl-5 text-xs text-[#9B4FDE] italic">{q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
