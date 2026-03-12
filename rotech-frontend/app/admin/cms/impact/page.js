'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import AdminLayout from '@/components/admin/AdminLayout'

const DEFAULTS = [
  { value: '500+', label: 'Students Trained',     icon: '🎓', sort_order: 0 },
  { value: '50+',  label: 'Businesses Supported', icon: '🏢', sort_order: 1 },
  { value: '10+',  label: 'Courses Available',    icon: '📚', sort_order: 2 },
  { value: '5',    label: 'Countries Reached',    icon: '🌍', sort_order: 3 },
]

export default function ImpactCMSPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [items, setItems]   = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && profile && profile.role !== 'admin') router.push('/dashboard')
  }, [user, profile, loading, router])

  useEffect(() => {
    if (!user) return
    supabase.from('lp_impact_metrics').select('*').order('sort_order').then(({ data }) => {
      if (data?.length) setItems(data)
    })
  }, [user])

  function update(i, key, val) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: val } : item))
  }

  async function handleSave() {
    setSaving(true)
    // Delete all and re-insert in order (simple strategy for a small fixed list)
    await supabase.from('lp_impact_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('lp_impact_metrics').insert(
      items.map((item, i) => ({ value: item.value, label: item.label, icon: item.icon, sort_order: i }))
    )
    await fetch('/api/revalidate', { method: 'POST' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading || !profile) return <PageSpinner />

  return (
    <AdminLayout profile={profile} title="CMS — Impact Metrics">
      <div className="max-w-2xl space-y-6">

        <p className="text-xs" style={{ color: '#C8D4E8' }}>
          These 4 stat cards appear in the &quot;Growing Across Africa&quot; section. Numbers animate when visitors scroll to them.
        </p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center p-4 rounded-xl border" style={{ backgroundColor: '#7B2FBE', borderColor: 'rgba(155,79,222,0.3)' }}>
              <div className="col-span-1">
                <input
                  className={`${INPUT} text-center text-lg`}
                  value={item.icon}
                  onChange={e => update(i, 'icon', e.target.value)}
                  maxLength={4}
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs text-[#C8D4E8] mb-1 block">Value</label>
                <input
                  className={INPUT}
                  value={item.value}
                  onChange={e => update(i, 'value', e.target.value)}
                  placeholder="e.g. 500+"
                />
              </div>
              <div className="col-span-8">
                <label className="text-xs text-[#C8D4E8] mb-1 block">Label</label>
                <input
                  className={INPUT}
                  value={item.label}
                  onChange={e => update(i, 'label', e.target.value)}
                  placeholder="e.g. Students Trained"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60" style={{ backgroundColor: '#6C3FD4' }}>
            {saving ? 'Saving…' : 'Publish Changes'}
          </button>
          {saved && <span className="text-xs font-semibold" style={{ color: '#10B981' }}>✓ Saved & published</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

const INPUT = 'w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#9B4FDE] transition-colors bg-[#3d1270] border-[#9B4FDE]/30'
