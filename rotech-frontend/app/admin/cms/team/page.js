'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'

const BLANK = {
  name: '', role: '', bio: '', photo_url: '',
  initials: '', avatar_color: '#6C3FD4', linkedin_url: '', is_active: true,
}

export default function TeamCMSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [items,   setItems]   = useState([])
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(BLANK)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && profile && profile.role !== 'admin') router.push('/dashboard')
  }, [user, profile, loading, router])

  useEffect(() => {
    if (!user) return
    supabase.from('lp_team').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data)
    })
  }, [user])

  function field(key) {
    return { value: form[key] ?? '', onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) }
  }

  function startNew()    { setForm(BLANK); setEditing('new') }
  function startEdit(it) { setForm(it);    setEditing(it.id) }
  function cancelEdit()  { setEditing(null) }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `team/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('landing-page-assets').upload(path, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('landing-page-assets').getPublicUrl(path)
      setForm(f => ({ ...f, photo_url: urlData.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.name.trim()) { setMsg('Name is required'); return }
    setSaving(true)
    const payload = { ...form, sort_order: editing === 'new' ? items.length : form.sort_order }
    delete payload.id

    if (editing === 'new') {
      const { data } = await supabase.from('lp_team').insert(payload).select().single()
      if (data) setItems(p => [...p, data])
    } else {
      await supabase.from('lp_team').update(payload).eq('id', editing)
      setItems(p => p.map(it => it.id === editing ? { ...it, ...payload, id: editing } : it))
    }
    await fetch('/api/revalidate', { method: 'POST' })
    setSaving(false)
    setMsg('✓ Saved & published')
    setEditing(null)
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteItem(id) {
    if (!confirm('Delete this team member?')) return
    await supabase.from('lp_team').delete().eq('id', id)
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
    await Promise.all(reordered.map((it, i) => supabase.from('lp_team').update({ sort_order: i }).eq('id', it.id)))
    fetch('/api/revalidate', { method: 'POST' })
  }

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="CMS — Team Members">
      <div className="max-w-3xl space-y-6">

        {msg && <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{msg}</p>}

        {editing === null && (
          <>
            <p className="text-xs" style={{ color: '#C8D4E8' }}>
              {items.length === 0 ? 'No team members yet — built-in placeholder cards will display until you add real profiles.' : `${items.length} team member(s).`}
            </p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
                  {item.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.photo_url} alt={item.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: item.avatar_color || '#6C3FD4' }}>
                      {item.initials || item.name?.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs" style={{ color: '#C8D4E8' }}>{item.role}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => move(item.id, -1)} disabled={i === 0} className="px-1.5 py-1 text-xs text-[#C8D4E8] disabled:opacity-30">↑</button>
                    <button onClick={() => move(item.id, 1)} disabled={i === items.length - 1} className="px-1.5 py-1 text-xs text-[#C8D4E8] disabled:opacity-30">↓</button>
                    <button onClick={() => startEdit(item)} className="px-2 py-1 text-xs rounded border border-[#9B4FDE]/30 text-[#C8D4E8]">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="px-2 py-1 text-xs rounded border border-red-500/30 text-red-300">Del</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={startNew} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: '#6C3FD4' }}>
              + Add Team Member
            </button>
          </>
        )}

        {editing !== null && (
          <div className="space-y-4 p-6 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
            <h3 className="text-sm font-bold text-white">{editing === 'new' ? 'New Team Member' : 'Edit Team Member'}</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LBL}>Full Name</label>
                <input className={INPUT} {...field('name')} placeholder="Dr. Jane Smith" />
              </div>
              <div>
                <label className={LBL}>Role / Title</label>
                <input className={INPUT} {...field('role')} placeholder="Founder & CEO" />
              </div>
              <div className="col-span-2">
                <label className={LBL}>Bio (1–2 sentences)</label>
                <textarea className={INPUT} rows={2} {...field('bio')} placeholder="Short professional bio…" />
              </div>
              <div>
                <label className={LBL}>Initials (2–3 chars)</label>
                <input className={INPUT} {...field('initials')} maxLength={3} placeholder="JS" />
              </div>
              <div>
                <label className={LBL}>Avatar Color</label>
                <input className={INPUT} {...field('avatar_color')} placeholder="#6C3FD4" />
              </div>
              <div className="col-span-2">
                <label className={LBL}>LinkedIn URL (optional)</label>
                <input className={INPUT} {...field('linkedin_url')} placeholder="https://linkedin.com/in/…" />
              </div>

              {/* Photo upload */}
              <div className="col-span-2">
                <label className={LBL}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  {form.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.photo_url} alt="Preview" className="h-12 w-12 rounded-full object-cover border-2 border-[#9B4FDE]/40" />
                  )}
                  <div>
                    <label className="cursor-pointer text-xs font-semibold px-4 py-2 rounded-lg border inline-block" style={{ borderColor: 'rgba(155,79,222,0.4)', color: '#C8D4E8' }}>
                      {uploading ? 'Uploading…' : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                    </label>
                    {form.photo_url && (
                      <button onClick={() => setForm(f => ({ ...f, photo_url: '' }))} className="ml-2 text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                </div>
                <p className="text-xs mt-1" style={{ color: '#9B4FDE' }}>
                  Or paste a URL: <input className="bg-transparent border-b border-[#9B4FDE]/40 outline-none text-white text-xs px-1 w-48" {...field('photo_url')} placeholder="https://…" />
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60" style={{ backgroundColor: '#6C3FD4' }}>
                {saving ? 'Saving…' : 'Save Member'}
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
