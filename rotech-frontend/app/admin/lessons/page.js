'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'

const LESSON_TYPES = ['reading', 'exercise', 'project']
const EMPTY = { title: '', content: '', type: 'reading', order_index: '', dataset_url: '' }

export default function AdminLessonsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,        setDomains]        = useState([])
  const [modules,        setModules]        = useState([])
  const [lessons,        setLessons]        = useState([])
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
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
    setSelectedModule('')
    setModules([])
    setLessons([])
    if (!selectedDomain) return
    supabase.from('modules').select('id, title, order_index').eq('domain_id', selectedDomain).order('order_index')
      .then(({ data }) => setModules(data ?? []))
  }, [selectedDomain])

  useEffect(() => {
    setLessons([])
    if (!selectedModule) return
    loadLessons()
  }, [selectedModule])

  async function loadLessons() {
    const { data } = await supabase
      .from('lessons').select('*').eq('module_id', selectedModule).order('order_index')
    setLessons(data ?? [])
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedModule)    { setError('Select a module first.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.content.trim()) { setError('Content is required.'); return }
    setSaving(true)
    const { error: err } = await supabase.from('lessons').insert({
      module_id:   selectedModule,
      title:       form.title.trim(),
      content:     form.content.trim(),
      type:        form.type,
      order_index: parseInt(form.order_index) || lessons.length + 1,
      dataset_url: form.dataset_url.trim() || null,
    })
    if (err) {
      setError(err.message)
    } else {
      setSuccess('Lesson added.')
      setForm({ ...EMPTY, order_index: String(lessons.length + 2) })
      await loadLessons()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    setLessons(prev => prev.filter(l => l.id !== id))
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Manage Lessons">

      {/* Domain + Module selectors */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Domain:</label>
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
          >
            <option value="">Choose domain...</option>
            {domains.map(d => <option key={d.id} value={d.id}>{d.icon} {d.title}</option>)}
          </select>
        </div>
        {selectedDomain && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#E8E0F0] shrink-0">Module:</label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="bg-[#7B2FBE] border border-[#9B4FDE]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
            >
              <option value="">Choose module...</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.order_index}. {m.title}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white mb-5">Add Lesson</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. What is Financial Data?"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Type *</label>
                <select
                  name="type" value={form.type} onChange={handleChange}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                >
                  {LESSON_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Order</label>
                <input
                  name="order_index" value={form.order_index} onChange={handleChange}
                  type="number" min="1" placeholder={lessons.length + 1}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">
                Content * <span className="text-[#C8D4E8] font-normal">(markdown supported)</span>
              </label>
              <textarea
                name="content" value={form.content} onChange={handleChange}
                rows={10} placeholder="## Lesson Title&#10;&#10;Write lesson content here. Markdown is supported.&#10;&#10;- Bullet point&#10;- Another point"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-y font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Dataset URL (optional)</label>
              <input
                name="dataset_url" value={form.dataset_url} onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

            <Button type="submit" fullWidth disabled={saving || !selectedModule}>
              {saving ? 'Saving...' : 'Add Lesson'}
            </Button>
          </form>
        </div>

        {/* ── Lesson list ──────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">
            {selectedModule ? `Lessons (${lessons.length})` : 'Select a module to view lessons'}
          </h2>
          {lessons.length === 0 && selectedModule && (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-8 text-center">
              <p className="text-[#C8D4E8] text-sm">No lessons yet for this module.</p>
            </div>
          )}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-[#9B4FDE] w-6 shrink-0">{lesson.order_index ?? i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                  <p className="text-xs text-[#C8D4E8] mt-0.5 capitalize">{lesson.type}</p>
                </div>
                <button
                  onClick={() => handleDelete(lesson.id)}
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
