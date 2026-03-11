'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const API = process.env.NEXT_PUBLIC_API_URL

const SUGGESTIONS = [
  'What is a pivot table?',
  'How do I calculate profit margin?',
  'What does correlation mean?',
  'How can I spot trends in my sales data?',
  'What is the difference between mean and median?',
]

function BotIcon() {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
      style={{ background: 'linear-gradient(135deg, #7B2FBE, #9B4FDE)' }}>
      R
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#9B4FDE] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m Rota 👋 your data analytics assistant. Ask me anything about data analysis, your business records, or how to read your insights.' }
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, loading])

  async function sendMessage(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setMessages(prev => [...prev, { role: 'bot', text: 'Please log in to chat with Rota.' }])
        setLoading(false)
        return
      }

      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: msg }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: res.status === 429
            ? 'You\'re sending messages too fast. Please wait a moment.'
            : 'Sorry, I could not get a response right now. Please try again.',
        }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please check your connection.' }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7B2FBE, #9B4FDE)' }}
        aria-label="Open chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[#9B4FDE]/40"
          style={{ maxHeight: '520px', background: '#3a1570' }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-[#9B4FDE]/30"
            style={{ background: 'linear-gradient(135deg, #5a1f9a, #7B2FBE)' }}>
            <BotIcon />
            <div>
              <p className="text-sm font-bold text-white">Rota</p>
              <p className="text-xs text-[#C8D4E8]">Data Analytics Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-300">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 280, maxHeight: 340 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && <BotIcon />}
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-none'
                    : 'text-[#E8E0F0] rounded-bl-none'
                }`}
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #7B2FBE, #9B4FDE)'
                      : '#4a1a8a',
                  }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <BotIcon />
                <div className="rounded-2xl rounded-bl-none" style={{ background: '#4a1a8a' }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only on first message) */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors bg-[#4a1a8a]/50">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#9B4FDE]/30 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask a data question..."
              disabled={loading}
              className="flex-1 bg-[#4a1a8a] border border-[#9B4FDE]/30 rounded-xl px-3 py-2 text-sm text-white placeholder-[#9B4FDE]/60 focus:outline-none focus:border-[#9B4FDE] transition disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40 shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #9B4FDE)' }}>
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
