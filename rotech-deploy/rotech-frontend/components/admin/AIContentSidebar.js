'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const QUICK_ACTIONS = {
  hero:        ['Generate 5 headline options', 'Write a badge/chip label', 'Write sub-headline copy', 'Generate 5 CTA variants'],
  course:      ['Write a course description', 'List 4 skill tags for this course', 'Write a course benefit statement'],
  testimonial: ['Write a student testimonial', 'Write a business owner testimonial', 'Improve this quote (paste below)'],
  general:     ['Suggest a section heading', 'Write a short paragraph', 'Generate 5 CTA variants'],
}

export default function AIContentSidebar({ context = 'general', onInsert }) {
  const [prompt,  setPrompt]  = useState('')
  const [result,  setResult]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function run(customPrompt) {
    const text = (customPrompt || prompt).trim()
    if (!text) return
    setLoading(true)
    setError('')
    setResult('')

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    try {
      const res = await fetch('/api/cms-ai', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ context, prompt: text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'AI request failed')
      setResult(json.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = QUICK_ACTIONS[context] || QUICK_ACTIONS.general

  return (
    <div
      className="rounded-xl border p-5 space-y-4"
      style={{ backgroundColor: 'rgba(108,63,212,0.08)', borderColor: 'rgba(139,92,246,0.3)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">🤖</span>
        <p className="text-sm font-bold text-white">AI Content Assistant</p>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(139,92,246,0.2)', color: '#C8D4E8' }}>
          {context}
        </span>
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map(action => (
          <button
            key={action}
            onClick={() => run(action)}
            disabled={loading}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:text-white disabled:opacity-50"
            style={{ borderColor: 'rgba(139,92,246,0.35)', color: '#C8D4E8' }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Custom prompt */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#C8D4E8]">Or write a custom request:</label>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#9B4FDE] transition-colors bg-[#3d1270] border-[#9B4FDE]/30"
            placeholder='e.g. "Write a headline for the SQL course…"'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
          />
          <button
            onClick={() => run()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 rounded-lg text-white font-bold text-xs transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#6C3FD4' }}
          >
            {loading ? '…' : 'Go'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#C8D4E8]">Result:</p>
          <div
            className="rounded-lg p-4 text-sm leading-relaxed border whitespace-pre-wrap"
            style={{ backgroundColor: '#3d1270', borderColor: 'rgba(155,79,222,0.3)', color: '#E8E0F0' }}
          >
            {result}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onInsert?.(result); setResult('') }}
              className="text-xs font-bold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#6C3FD4' }}
            >
              Use This ↑
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(result)}
              className="text-xs font-medium px-4 py-2 rounded-lg border text-[#C8D4E8] hover:text-white"
              style={{ borderColor: 'rgba(155,79,222,0.3)' }}
            >
              Copy
            </button>
            <button
              onClick={() => setResult('')}
              className="text-xs text-[#9B4FDE] hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
