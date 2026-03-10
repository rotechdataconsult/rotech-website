'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'

const EMPTY = { title: '', icon: '', description: '' }

export default function AdminDomainsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,     setDomains]     = useState([])
  const [form,        setForm]        = useState(EMPTY)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    if (profile && profile.role !== 'admin') { router.push('/dashboard'); return }
    load()
  }, [user, profile, router])

  async function load() {
    const { data } = await supabase.from('domains').select('*').order('title')
    setDomains(data ?? [])
    setDataLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.icon.trim())  { setError('Icon emoji is required.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('domains').insert({
      title:       form.title.trim(),
      icon:        form.icon.trim(),
      description: form.description.trim() || null,
      is_active:   true,
    })
    if (err) {
      setError(err.message)
    } else {
      setSuccess('Domain created.')
      setForm(EMPTY)
      await load()
    }
    setSaving(false)
  }

  async function toggleActive(domain) {
    await supabase.from('domains').update({ is_active: !domain.is_active }).eq('id', domain.id)
    setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, is_active: !d.is_active } : d))
  }

  async function handleDelete(id) {
    if (!confirm('Delete this domain? All linked modules and lessons will also be deleted.')) return
    await supabase.from('domains').delete().eq('id', id)
    setDomains(prev => prev.filter(d => d.id !== id))
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Manage Domains">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white mb-5">Add New Domain</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Fintech Analytics"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Icon (paste emoji) *</label>
              <input
                name="icon" value={form.icon} onChange={handleChange}
                placeholder="e.g. 💰"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="What students will learn in this domain..."
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-none"
              />
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

            <Button type="submit" fullWidth disabled={saving}>
              {saving ? 'Saving...' : 'Create Domain'}
            </Button>
          </form>
        </div>

        {/* ── List ────────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">Domains ({domains.length})</h2>
          {domains.length === 0 ? (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">No domains yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {domains.map(d => (
                <div key={d.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl shrink-0">{d.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{d.title}</p>
                    <p className="text-xs text-[#C8D4E8] truncate">{d.description ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(d)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        d.is_active
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                      }`}
                    >
                      {d.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
