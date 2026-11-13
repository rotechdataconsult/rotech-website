'use client'

import { useState } from 'react'
import { SITE } from '@/lib/site'

const FIELD = 'mt-1.5 w-full rounded-xl border-2 border-brand-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none'
const LABEL = 'block text-sm font-bold text-ink'

/**
 * Enquiry form that needs no backend: it builds a WhatsApp message from the
 * answers and opens the chat with Rotech, so every enquiry lands in one inbox.
 *
 * topics: list of options for the "interested in" select
 * defaultTopic: preselected option
 */
export default function EnquiryForm({ topics, defaultTopic, heading = 'Send us a message', submitLabel = 'Send on WhatsApp' }) {
  const [form, setForm] = useState({ name: '', topic: defaultTopic || topics[0], mode: 'Not sure yet', message: '' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    const lines = [
      `Hello Rotech, my name is ${form.name.trim()}.`,
      `I am interested in: ${form.topic}.`,
      `Preferred mode: ${form.mode}.`,
      form.message.trim() ? `Message: ${form.message.trim()}` : null,
    ].filter(Boolean)
    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-brand-200 bg-brand-50 p-6 text-ink sm:p-8">
      <h2 className="font-display text-2xl font-extrabold">{heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Fill this in and it opens WhatsApp with your message ready to send. We reply with fees, dates and next steps.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="enq-name" className={LABEL}>Your name</label>
          <input id="enq-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={set('name')} placeholder="e.g. Amina Yusuf" className={FIELD} />
        </div>
        <div>
          <label htmlFor="enq-topic" className={LABEL}>I am interested in</label>
          <select id="enq-topic" name="topic" value={form.topic} onChange={set('topic')} className={FIELD}>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="enq-mode" className={LABEL}>How would you like to learn or work with us?</label>
          <select id="enq-mode" name="mode" value={form.mode} onChange={set('mode')} className={FIELD}>
            {['Physical class in Abuja', 'Online (virtual)', 'For my organisation', 'Not sure yet'].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="enq-message" className={LABEL}>Anything else? <span className="font-normal text-ink-muted">(optional)</span></label>
          <textarea id="enq-message" name="message" rows={3} value={form.message} onChange={set('message')} placeholder="Your background, questions, or what your team needs" className={FIELD} />
        </div>
      </div>

      <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700">
        {submitLabel}
      </button>
      <p className="mt-3 text-center text-xs text-ink-muted">
        Prefer to call or text? {SITE.phoneDisplay}
      </p>
    </form>
  )
}
