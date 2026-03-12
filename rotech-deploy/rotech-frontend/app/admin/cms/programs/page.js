'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import AIContentSidebar from '@/components/admin/AIContentSidebar'

const BLANK = {
  title: '', description: '', icon: '📊',
  icon_bg: '#DCFCE7', icon_color: '#16A34A',
  level: 'Beginner', duration: '4 weeks', lessons: '12 lessons',
  skills: '', cta_href: '/auth/register', is_active: true,
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function ProgramsCMSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [items,   setItems]   = useState([])
  const [editing, setEditing] = useState(null)   // null | 'new' | item.id
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
    supabase.from('lp_programs').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data)
    })
  }, [user])

  function field(key) {
    return { value: form[key] ?? '', onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) }
  }

  function startNew() {
    setForm(BLANK)
    setEditing('new')
    setAiOpen(false)
  }

  function startEdit(item) {
    setForm({ ...item, skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '') })
    setEditing(item.id)
    setAiOpen(false)
  }

  function cancelEdit() { setEditing(null); setAiOpen(false) }

  async function handleSave() {
    if (!form.title.trim()) { setMsg('Title is required'); return }
    setSaving(true)
    const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    const payload = { ...form, skills: skillsArr, sort_order: editing === 'new' ? items.length : form.sort_order }
    delete payload.id

    if (editing === 'new') {
      const { data } = await supabase.from('lp_programs').insert(payload).select().single()
      if (data) setItems(prev => [...prev, data])
    } else {
      await supabase.from('lp_programs').update(payload).eq('id', editing)
      setItems(prev => prev.map(it => it.id === editing ? { ...it, ...payload, id: editing } : it))
    }
    await fetch('/api/revalidate', { method: 'POST' })
    setSaving(false)
    setMsg('✓ Saved & published')
    setEditing(null)
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleActive(item) {
    await supabase.from('lp_programs').update({ is_active: !item.is_active }).eq('id', item.id)
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, is_active: !it.is_active } : it))
    fetch('/api/revalidate', { method: 'POST' })
  }

  async function deleteItem(id) {
    if (!confirm('Delete this program?')) return
    await supabase.from('lp_programs').delete().eq('id', id)
    setItems(prev => prev.filter(it => it.id !== id))
    fetch('/api/revalidate', { method: 'POST' })
  }

  async function move(id, dir) {
    const idx = items.findIndex(it => it.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= items.length) return
    const reordered = [...items]
    ;[reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]]
    setItems(reordered)
    await Promise.all(reordered.map((it, i) => supabase.from('lp_programs').update({ sort_order: i }).eq('id', it.id)))
    fetch('/api/revalidate', { method: 'POST' })
  }

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="CMS — Learning Programs">
      <div className="max-w-3xl space-y-6">

        {msg && <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{msg}</p>}

        {/* List */}
        {editing === null && (
          <>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                    <p className="text-xs" style={{ color: '#C8D4E8' }}>{item.level} · {item.duration}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {item.is_active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => move(item.id, -1)} disabled={i === 0} className="px-1.5 py-1 text-xs rounded text-[#C8D4E8] hover:text-white disabled:opacity-30">↑</button>
                    <button onClick={() => move(item.id, 1)} disabled={i === items.length - 1} className="px-1.5 py-1 text-xs rounded text-[#C8D4E8] hover:text-white disabled:opacity-30">↓</button>
                    <button onClick={() => toggleActive(item)} className="px-2.5 py-1 text-xs rounded border border-[#9B4FDE]/30 text-[#C8D4E8] hover:text-white">
                      {item.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => startEdit(item)} className="px-2.5 py-1 text-xs rounded border border-[#9B4FDE]/30 text-[#C8D4E8] hover:text-white">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="px-2.5 py-1 text-xs rounded border border-red-500/30 text-red-300 hover:text-red-200">Del</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={startNew} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: '#6C3FD4' }}>
              + Add Program
            </button>
          </>
        )}

        {/* Edit / New form */}
        {editing !== null && (
          <div className="space-y-5 p-6 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{editing === 'new' ? 'New Program' : 'Edit Program'}</h3>
              <button
                onClick={() => setAiOpen(o => !o)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                style={{ borderColor: 'rgba(139,92,246,0.4)', color: '#C8D4E8' }}
              >
                🤖 AI Help
              </button>
            </div>

            {aiOpen && (
              <AIContentSidebar
                context="course"
                onInsert={text => setForm(f => ({ ...f, description: text }))}
                userToken={null}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={LBL}>Title</label>
                <input className={INPUT} {...field('title')} placeholder="Excel for Data Analysis" />
              </div>
              <div className="col-span-2">
                <label className={LBL}>Description</label>
                <textarea className={INPUT} rows={2} {...field('description')} placeholder="Short course description…" />
              </div>
              <div>
                <label className={LBL}>Icon (emoji)</label>
                <input className={INPUT} {...field('icon')} maxLength={4} />
              </div>
              <div>
                <label className={LBL}>Level</label>
                <select className={INPUT} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={LBL}>Duration</label>
                <input className={INPUT} {...field('duration')} placeholder="4 weeks" />
              </div>
              <div>
                <label className={LBL}>Lessons</label>
                <input className={INPUT} {...field('lessons')} placeholder="18 lessons" />
              </div>
              <div className="col-span-2">
                <label className={LBL}>Skills (comma-separated)</label>
                <input className={INPUT} {...field('skills')} placeholder="Pivot Tables, VLOOKUP, Charts" />
              </div>
              <div>
                <label className={LBL}>Icon Background Color</label>
                <input className={INPUT} {...field('icon_bg')} placeholder="#DCFCE7" />
              </div>
              <div>
                <label className={LBL}>CTA Link</label>
                <input className={INPUT} {...field('cta_href')} placeholder="/auth/register" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60" style={{ backgroundColor: '#6C3FD4' }}>
                {saving ? 'Saving…' : 'Save Program'}
              </button>
              <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-sm border text-[#C8D4E8] hover:text-white" style={{ borderColor: 'rgba(155,79,222,0.3)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

const LBL   = 'text-xs font-bold text-[#C8D4E8] block mb-1'
const INPUT = 'w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#9B4FDE] transition-colors bg-[#3d1270] border-[#9B4FDE]/30'
