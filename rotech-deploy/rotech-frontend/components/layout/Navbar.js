'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar({ profile, back, backLabel }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-[#5a1f9a] border-b border-[#9B4FDE]/30 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

        {/* Left: back link or brand */}
        {back ? (
          <Link href={back} className="flex items-center gap-2 text-sm text-[#E8E0F0] hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel ?? 'Back'}
          </Link>
        ) : (
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </Link>
        )}

        {/* Center: brand when back is shown */}
        {back && (
          <Link href="/dashboard" className="text-base font-bold tracking-tight text-white hidden sm:block">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </Link>
        )}

        {/* Right: nav links + user */}
        <div className="flex items-center gap-3">
          <Link href="/resources" className="text-xs text-[#E8E0F0] hover:text-white transition-colors hidden md:block">
            Resources
          </Link>
          <Link href="/analyst" className="text-xs text-[#E8E0F0] hover:text-white transition-colors hidden md:block">
            Analyst Tool
          </Link>
          {profile?.full_name && (
            <span className="text-xs text-[#E8E0F0] font-medium hidden sm:block">{profile.full_name}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:border-[#9B4FDE] hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
