'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import AIContentSidebar from '@/components/admin/AIContentSidebar'

const BLANK = {
  quote: '', author_name: '', author_role: '', author_location: '',
  author_initials: '', avatar_color: '#6C3FD4', photo_url: '', rating: 5, is_active: true,
}

export default function TestimonialsCMSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [items,   setItems]   = useState([])
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(BLANK)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [aiOpen,  setAiOpen]  = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && profile && profile.role !== 'admin') router.push('/dashboard')
  }, [user, profile, loading, router])

  useEffect(() => {
    if (!user) return
    supabase.from('lp_testimonials').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data)
    })
  }, [user])

  function field(key) {
    return { value: form[key] ?? '', onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) }
  }

  function startNew()    { setForm(BLANK);        setEditing('new') }
  function startEdit(it) { setForm(it);           setEditing(it.id) }
  function cancelEdit()  { setEditing(null);      setAiOpen(false)  }

  async function handleSave() {
    if (!form.quote.trim() || !form.author_name.trim()) { setMsg('Quote and name are required'); return }
    setSaving(true)
    const payload = { ...form, sort_order: editing === 'new' ? items.length : form.sort_order }
    delete payload.id

    if (editing === 'new') {
      const { data } = await supabase.from('lp_testimonials').insert(payload).select().single()
      if (data) setItems(p => [...p, data])
    } else {
      await supabase.from('lp_testimonials').update(payload).eq('id', editing)
      setItems(p => p.map(it => it.id === editing ? { ...it, ...payload, id: editing } : it))
    }
    await fetch('/api/revalidate', { method: 'POST' })
    setSaving(false)
    setMsg('✓ Saved & published')
    setEditing(null)
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleActive(item) {
    await supabase.from('lp_testimonials').update({ is_active: !item.is_active }).eq('id', item.id)
    setItems(p => p.map(it => it.id === item.id ? { ...it, is_active: !it.is_active } : it))
    fetch('/api/revalidate', { method: 'POST' })
  }

  async function deleteItem(id) {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('lp_testimonials').delete().eq('id', id)
    setItems(p => p.filter(it => it.id !== id))
    fetch('/api/revalidate', { method: 'POST' })
  }

  async function move(id, dir) {
    const idx = items.findIndex(it => it.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= items.length) return
    const reordered = [...items]
    ;[reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]]
    setItems(reordered)
    await Promise.all(reordered.map((it, i) => supabase.from('lp_testimonials').update({ sort_order: i }).eq('id', it.id)))
    fetch('/api/revalidate', { method: 'POST' })
  }

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="CMS — Testimonials">
      <div className="max-w-3xl space-y-6">

        {msg && <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{msg}</p>}

        {editing === null && (
          <>
            <p className="text-xs" style={{ color: '#C8D4E8' }}>
              {items.length === 0 ? 'No testimonials yet — built-in placeholder stories will display until you add real ones.' : `${items.length} testimonial(s). The carousel shows 3 at a time on desktop.`}
            </p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: item.avatar_color || '#6C3FD4' }}>
                    {item.author_initials || item.author_name?.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{item.author_name}</p>
                    <p className="text-xs" style={{ color: '#C8D4E8' }}>{item.author_role}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#9B4FDE' }}>&ldquo;{item.quote}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {item.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <button onClick={() => move(item.id, -1)} disabled={i === 0} className="px-1.5 py-1 text-xs text-[#C8D4E8] disabled:opacity-30">↑</button>
                    <button onClick={() => move(item.id, 1)} disabled={i === items.length - 1} className="px-1.5 py-1 text-xs text-[#C8D4E8] disabled:opacity-30">↓</button>
                    <button onClick={() => toggleActive(item)} className="px-2 py-1 text-xs rounded border border-[#9B4FDE]/30 text-[#C8D4E8]">{item.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => startEdit(item)} className="px-2 py-1 text-xs rounded border border-[#9B4FDE]/30 text-[#C8D4E8]">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="px-2 py-1 text-xs rounded border border-red-500/30 text-red-300">Del</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={startNew} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: '#6C3FD4' }}>
              + Add Testimonial
            </button>
          </>
        )}

        {editing !== null && (
          <div className="space-y-4 p-6 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{editing === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setAiOpen(o => !o)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(139,92,246,0.4)', color: '#C8D4E8' }}>
                🤖 AI Help
              </button>
            </div>

            {aiOpen && (
              <AIContentSidebar
                context="testimonial"
                onInsert={text => setForm(f => ({ ...f, quote: text }))}
                userToken={null}
              />
            )}

            <div className="space-y-3">
              <div>
                <label className={LBL}>Quote (the testimonial text)</label>
                <textarea className={INPUT} rows={3} {...field('quote')} placeholder="Write the student's experience…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LBL}>Author Name</label>
                  <input className={INPUT} {...field('author_name')} placeholder="Amara Okonkwo" />
                </div>
                <div>
                  <label className={LBL}>Role / Title</label>
                  <input className={INPUT} {...field('author_role')} placeholder="Data Analyst" />
                </div>
                <div>
                  <label className={LBL}>Location</label>
                  <input className={INPUT} {...field('author_location')} placeholder="Lagos, Nigeria" />
                </div>
                <div>
                  <label className={LBL}>Initials (2 chars)</label>
                  <input className={INPUT} {...field('author_initials')} maxLength={3} placeholder="AO" />
                </div>
                <div>
                  <label className={LBL}>Avatar Color</label>
                  <input className={INPUT} {...field('avatar_color')} placeholder="#6C3FD4" />
                </div>
                <div>
                  <label className={LBL}>Photo URL (optional)</label>
                  <input className={INPUT} {...field('photo_url')} placeholder="https://…" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60" style={{ backgroundColor: '#6C3FD4' }}>
                {saving ? 'Saving…' : 'Save Testimonial'}
              </button>
              <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-sm border text-[#C8D4E8]" style={{ borderColor: 'rgba(155,79,222,0.3)' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

const LBL   = 'text-xs font-bold text-[#C8D4E8] block mb-1'
const INPUT = 'w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#9B4FDE] transition-colors bg-[#3d1270] border-[#9B4FDE]/30'
