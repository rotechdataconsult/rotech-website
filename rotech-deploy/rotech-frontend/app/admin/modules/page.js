'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { TOOLS } from '@/lib/constants'

const EMPTY = { title: '', description: '', tool: '', order_index: '' }

export default function AdminModulesPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,        setDomains]        = useState([])
  const [selectedDomain, setSelectedDomain] = useState('')
  const [modules,        setModules]        = useState([])
  const [form,           setForm]           = useState(EMPTY)
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
    if (!selectedDomain) { setModules([]); return }
    loadModules()
  }, [selectedDomain])

  async function loadModules() {
    const { data } = await supabase
      .from('modules').select('*').eq('domain_id', selectedDomain).order('order_index')
    setModules(data ?? [])
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDomain)    { setError('Select a domain first.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('modules').insert({
      domain_id:   selectedDomain,
      title:       form.title.trim(),
      description: form.description.trim() || null,
      tool:        form.tool || null,
      order_index: parseInt(form.order_index) || modules.length + 1,
    })
    if (err) {
      setError(err.message)
    } else {
      setSuccess('Module added.')
      setForm(EMPTY)
      await loadModules()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this module and all its lessons?')) return
    await supabase.from('modules').delete().eq('id', id)
    setModules(prev => prev.filter(m => m.id !== id))
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Manage Modules">

      {/* Domain selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Domain:</label>
        <select
          value={selectedDomain}
          onChange={e => setSelectedDomain(e.target.value)}
          className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
        >
          <option value="">Choose a domain...</option>
          {domains.map(d => <option key={d.id} value={d.id}>{d.icon} {d.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white mb-5">Add Module</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Introduction to Financial Data"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Tool</label>
                <select
                  name="tool" value={form.tool} onChange={handleChange}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                >
                  <option value="">No tool</option>
                  {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Order</label>
                <input
                  name="order_index" value={form.order_index} onChange={handleChange}
                  type="number" min="1" placeholder={modules.length + 1}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="What students will learn in this module..."
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-none"
              />
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

            <Button type="submit" fullWidth disabled={saving || !selectedDomain}>
              {saving ? 'Saving...' : 'Add Module'}
            </Button>
          </form>
        </div>

        {/* ── List ────────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">
            {selectedDomain ? `Modules (${modules.length})` : 'Select a domain to view modules'}
          </h2>
          {modules.length === 0 && selectedDomain && (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">No modules yet for this domain.</p>
            </div>
          )}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {modules.map((mod, i) => (
              <div key={mod.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-[#9B4FDE] w-6 shrink-0">{mod.order_index ?? i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{mod.title}</p>
                  {mod.tool && <p className="text-xs text-[#C8D4E8] mt-0.5">{mod.tool}</p>}
                </div>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
