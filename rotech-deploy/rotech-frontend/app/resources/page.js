'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import VideoCard from '@/components/lms/VideoCard'
import { TOOLS } from '@/lib/constants'

const ALL = 'All'

export default function ResourcesPage() {
  const { user, profile, loading: authLoading } = useAuth()

  const [resources,   setResources]   = useState([])
  const [domains,     setDomains]     = useState([])
  const [domainFilter,setDomainFilter]= useState(ALL)
  const [toolFilter,  setToolFilter]  = useState(ALL)
  const [search,      setSearch]      = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: resourceData }, { data: domainData }] = await Promise.all([
        supabase
          .from('youtube_resources')
          .select('*, domains(id, title, icon)')
          .order('created_at', { ascending: false }),
        supabase.from('domains').select('id, title, icon').eq('is_active', true).order('title'),
      ])
      setResources(resourceData ?? [])
      setDomains(domainData ?? [])
      setDataLoading(false)
    }
    load()
  }, [user])

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchDomain = domainFilter === ALL || r.domain_id === domainFilter
      const matchTool   = toolFilter   === ALL || r.tool === toolFilter
      const matchSearch = !search      || r.title.toLowerCase().includes(search.toLowerCase())
      return matchDomain && matchTool && matchSearch
    })
  }, [resources, domainFilter, toolFilter, search])

  if (authLoading || dataLoading) return <PageSpinner />

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0F172A' }}>
      <Navbar profile={profile} back="/dashboard" backLabel="Dashboard" />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-white">Learning Resources</h1>
          <p className="mt-1 text-slate-300 text-sm">
            Revisit concepts through curated video lessons. Filter by domain or tool.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
          />

          {/* Domain filter */}
          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition cursor-pointer"
          >
            <option value={ALL}>All Domains</option>
            {domains.map(d => (
              <option key={d.id} value={d.id}>{d.icon} {d.title}</option>
            ))}
          </select>

          {/* Tool filter */}
          <select
            value={toolFilter}
            onChange={e => setToolFilter(e.target.value)}
            className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition cursor-pointer"
          >
            <option value={ALL}>All Tools</option>
            {TOOLS.filter(t => t !== 'Capstone').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-400">
          {filtered.length} video{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Video grid */}
        {filtered.length === 0 ? (
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-16 text-center">
            <p className="text-4xl mb-3">&#127909;</p>
            <p className="text-white font-semibold mb-1">No videos found</p>
            <p className="text-slate-400 text-sm">
              {resources.length === 0
                ? 'Your instructor has not added any videos yet.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(resource => (
              <VideoCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
