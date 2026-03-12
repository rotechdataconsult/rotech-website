'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import AIContentSidebar from '@/components/admin/AIContentSidebar'

const DEFAULTS = {
  badge_text:          "Africa's Data Analytics Academy",
  headline:            'Monitor. Analyse. Thrive.',
  subheadline:         'Empowering individuals, teams, and businesses with the skills, tools, and insights to compete in a data-driven economy — built for Africa.',
  cta_primary_label:   'Start Learning Free',
  cta_primary_href:    '/auth/register',
  cta_secondary_label: 'Business Solutions →',
  cta_secondary_href:  '#business',
}

export default function HeroCMSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [form, setForm]     = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [rowId, setRowId]   = useState(null)
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && profile && profile.role !== 'admin') router.push('/dashboard')
  }, [user, profile, loading, router])

  useEffect(() => {
    if (!user) return
    supabase.from('lp_hero').select('*').maybeSingle().then(({ data }) => {
      if (data) { setForm({ ...DEFAULTS, ...data }); setRowId(data.id) }
    })
  }, [user])

  function field(key) {
    return {
      value: form[key] ?? '',
      onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    if (rowId) {
      await supabase.from('lp_hero').update(payload).eq('id', rowId)
    } else {
      const { data } = await supabase.from('lp_hero').insert(payload).select().single()
      if (data) setRowId(data.id)
    }
    // Trigger ISR revalidation
    await fetch('/api/revalidate', { method: 'POST' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function applyAI(text) {
    // AI sidebar injects text into the headline field by default
    setForm(f => ({ ...f, headline: text }))
  }

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="CMS — Hero Section">
      <div className="max-w-2xl space-y-6">

        {/* AI toggle */}
        <button
          onClick={() => setAiOpen(o => !o)}
          className="text-xs font-semibold px-4 py-2 rounded-lg border transition-colors"
          style={{ borderColor: 'rgba(139,92,246,0.4)', color: '#C8D4E8', backgroundColor: 'rgba(108,63,212,0.12)' }}
        >
          🤖 {aiOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        </button>

        {aiOpen && <AIContentSidebar context="hero" onInsert={applyAI} token={null} userToken={user?.access_token} />}

        <Field label="Badge Text" hint="Small chip label above the headline">
          <input className={INPUT} {...field('badge_text')} />
        </Field>
        <Field label="Headline" hint="Main hero heading (keep short and punchy)">
          <input className={INPUT} {...field('headline')} />
        </Field>
        <Field label="Sub-headline" hint="Supporting description paragraph">
          <textarea className={INPUT} rows={3} {...field('subheadline')} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary CTA Label">
            <input className={INPUT} {...field('cta_primary_label')} />
          </Field>
          <Field label="Primary CTA Link">
            <input className={INPUT} {...field('cta_primary_href')} />
          </Field>
          <Field label="Secondary CTA Label">
            <input className={INPUT} {...field('cta_secondary_label')} />
          </Field>
          <Field label="Secondary CTA Link">
            <input className={INPUT} {...field('cta_secondary_href')} />
          </Field>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#6C3FD4' }}
          >
            {saving ? 'Saving…' : 'Publish Changes'}
          </button>
          {saved && <span className="text-xs font-semibold" style={{ color: '#10B981' }}>✓ Saved & published</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-white">{label}</label>
      {hint && <p className="text-xs" style={{ color: '#9B4FDE' }}>{hint}</p>}
      {children}
    </div>
  )
}

const INPUT = 'w-full rounded-lg px-3 py-2.5 text-sm text-white border outline-none focus:border-[#9B4FDE] transition-colors bg-[#3d1270] border-[#9B4FDE]/30 placeholder-[#9B4FDE]/40'
