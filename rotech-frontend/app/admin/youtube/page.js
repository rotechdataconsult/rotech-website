'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { ToolBadge } from '@/components/ui/Badge'
import VideoCard from '@/components/lms/VideoCard'
import { TOOLS } from '@/lib/constants'
import { isValidYouTubeUrl, getThumbnail } from '@/lib/youtube'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const EMPTY_FORM = {
  title: '', youtube_url: '', description: '', domain_id: '',
  tool: '', instructor: '', duration_mins: '', level: '', module_id: '',
}

export default function AdminYouTubePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [domains,     setDomains]     = useState([])
  const [modules,     setModules]     = useState([])
  const [resources,   setResources]   = useState([])
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [preview,     setPreview]     = useState(null)
  const [editingId,   setEditingId]   = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [deleting,    setDeleting]    = useState(null)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    if (profile && profile.role !== 'admin') { router.push('/dashboard'); return }
    loadData()
  }, [user, profile, router])

  // Load modules when domain changes
  useEffect(() => {
    setModules([])
    setForm(prev => ({ ...prev, module_id: '' }))
    if (!form.domain_id) return
    supabase.from('modules').select('id, title, order_index')
      .eq('domain_id', form.domain_id).order('order_index')
      .then(({ data }) => setModules(data ?? []))
  }, [form.domain_id])

  async function loadData() {
    const [{ data: domainData }, { data: resourceData }] = await Promise.all([
      supabase.from('domains').select('id, title, icon').eq('is_active', true).order('title'),
      supabase.from('youtube_resources')
        .select('*, domains(id, title, icon), modules(id, title)')
        .order('created_at', { ascending: false }),
    ])
    setDomains(domainData ?? [])
    setResources(resourceData ?? [])
    setDataLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
    if (name === 'youtube_url') setPreview(getThumbnail(value))
  }

  function startEdit(r) {
    setEditingId(r.id)
    setForm({
      title:        r.title ?? '',
      youtube_url:  r.youtube_url ?? '',
      description:  r.description ?? '',
      domain_id:    r.domain_id ?? '',
      tool:         r.tool ?? '',
      instructor:   r.instructor ?? '',
      duration_mins: r.duration_mins ? String(r.duration_mins) : '',
      level:        r.level ?? '',
      module_id:    r.module_id ?? '',
    })
    setPreview(getThumbnail(r.youtube_url))
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setPreview(null)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim())                   { setError('Title is required.'); return }
    if (!isValidYouTubeUrl(form.youtube_url)) { setError('Please enter a valid YouTube URL.'); return }
    if (!form.domain_id)                      { setError('Please select a domain.'); return }

    setSaving(true)

    const payload = {
      title:        form.title.trim(),
      youtube_url:  form.youtube_url.trim(),
      description:  form.description.trim() || null,
      domain_id:    form.domain_id,
      tool:         form.tool || null,
      instructor:   form.instructor.trim() || null,
      duration_mins: parseInt(form.duration_mins) || null,
      level:        form.level || null,
      module_id:    form.module_id || null,
    }

    let err
    if (editingId) {
      const res = await supabase.from('youtube_resources').update(payload).eq('id', editingId)
      err = res.error
    } else {
      const res = await supabase.from('youtube_resources').insert({ ...payload, created_by: user.id })
      err = res.error
    }

    if (err) {
      setError(err.message || 'Failed to save. Please try again.')
    } else {
      setSuccess(editingId ? 'Video updated!' : 'Video added successfully!')
      cancelEdit()
      await loadData()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this video?')) return
    setDeleting(id)
    await supabase.from('youtube_resources').delete().eq('id', id)
    setResources(prev => prev.filter(r => r.id !== id))
    if (editingId === id) cancelEdit()
    setDeleting(null)
  }

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="Manage YouTube Resources">
      <p className="text-[#E8E0F0] text-sm mb-6">
        Add video links for students to revisit concepts they have forgotten.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Form ─────────────────────────────────────────── */}
        <div className={`border rounded-xl p-6 ${editingId ? 'bg-[#4a1580] border-[#9B4FDE]/60' : 'bg-[#7B2FBE] border-[#9B4FDE]/30'}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">
              {editingId ? 'Edit Video' : 'Add New Video'}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors"
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Video Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Intro to Pivot Tables in Excel"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">YouTube URL *</label>
              <input
                name="youtube_url" value={form.youtube_url} onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
              />
              {preview && (
                <img src={preview} alt="thumbnail" className="mt-2 rounded-lg w-full max-w-xs aspect-video object-cover" />
              )}
              {form.youtube_url && !preview && (
                <p className="text-xs text-red-400 mt-1">Invalid YouTube URL — paste a valid link</p>
              )}
            </div>

            {/* Domain + Module row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Domain *</label>
                <select
                  name="domain_id" value={form.domain_id} onChange={handleChange}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                >
                  <option value="">Select domain...</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.icon} {d.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Module (optional)</label>
                <select
                  name="module_id" value={form.module_id} onChange={handleChange}
                  disabled={!form.domain_id || modules.length === 0}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer disabled:opacity-50"
                >
                  <option value="">All modules</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.order_index}. {m.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tool + Level row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Tool (optional)</label>
                <select
                  name="tool" value={form.tool} onChange={handleChange}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                >
                  <option value="">All tools / General</option>
                  {TOOLS.filter(t => t !== 'Capstone').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Level (optional)</label>
                <select
                  name="level" value={form.level} onChange={handleChange}
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#9B4FDE] transition cursor-pointer"
                >
                  <option value="">Select level...</option>
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instructor + Duration row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Instructor (optional)</label>
                <input
                  name="instructor" value={form.instructor} onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Duration (mins, optional)</label>
                <input
                  name="duration_mins" value={form.duration_mins} onChange={handleChange}
                  type="number" min="1" placeholder="e.g. 15"
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8E0F0] mb-1.5">Description (optional)</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={3}
                placeholder="Brief description of what students will learn..."
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none focus:border-[#9B4FDE] transition resize-none"
              />
            </div>

            {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">{success}</p>}

            <div className="flex gap-3">
              <Button type="submit" fullWidth disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
              )}
            </div>
          </form>
        </div>

        {/* ── Video list ────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">
            Uploaded Videos{' '}
            <span className="text-[#9B4FDE] font-normal">({resources.length})</span>
          </h2>

          {resources.length === 0 ? (
            <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-10 text-center">
              <p className="text-[#C8D4E8] text-sm">No videos uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {resources.map(r => (
                <div
                  key={r.id}
                  className={`border rounded-xl p-4 transition-colors ${
                    editingId === r.id
                      ? 'bg-[#4a1580] border-[#9B4FDE]/60'
                      : 'bg-[#7B2FBE] border-[#9B4FDE]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{r.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {r.tool && <ToolBadge tool={r.tool} size="xs" />}
                        {r.level && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[#9B4FDE]/20 text-[#C8D4E8]">{r.level}</span>
                        )}
                        {r.domains?.title && (
                          <span className="text-xs text-[#C8D4E8]">{r.domains.icon} {r.domains.title}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {r.instructor && (
                          <span className="text-xs text-[#C8D4E8]">👤 {r.instructor}</span>
                        )}
                        {r.duration_mins && (
                          <span className="text-xs text-[#C8D4E8]">⏱ {r.duration_mins} min</span>
                        )}
                        {r.modules?.title && (
                          <span className="text-xs text-[#C8D4E8]">📂 {r.modules.title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#9B4FDE]/40 text-[#C8D4E8] hover:text-white hover:border-[#9B4FDE] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {deleting === r.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student preview */}
      {resources.length > 0 && (
        <section className="mt-8">
          <h2 className="text-base font-bold text-white mb-5">
            Student Preview
            <span className="text-xs font-normal text-[#C8D4E8] ml-2">how it looks on /resources</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.slice(0, 6).map(r => (
              <VideoCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}
    </AdminLayout>
  )
}
