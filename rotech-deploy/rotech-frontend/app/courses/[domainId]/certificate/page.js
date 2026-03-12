'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'
import { PageSpinner } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'

export default function CertificatePage() {
  const { domainId } = useParams()
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [certificate, setCertificate] = useState(null)
  const [domain,      setDomain]      = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: certData }, { data: domainData }] = await Promise.all([
        supabase.from('certificates').select('*').eq('user_id', user.id).eq('domain_id', domainId).maybeSingle(),
        supabase.from('domains').select('*').eq('id', domainId).single(),
      ])
      if (!certData) { router.push(`/courses/${domainId}`); return }
      setCertificate(certData)
      setDomain(domainData)
      setDataLoading(false)
    }
    load()
  }, [user, domainId, router])

  if (authLoading || dataLoading) return <PageSpinner />

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#5a1f9a] text-white">
      {/* Hide navbar on print */}
      <div className="print:hidden">
        <Navbar profile={profile} back="/dashboard" backLabel="Dashboard" />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Action bar — hidden on print */}
        <div className="flex items-center justify-between print:hidden">
          <h1 className="text-xl font-bold text-white">Your Certificate</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              &#128438; Print / Save PDF
            </Button>
            <Link
              href="/dashboard"
              className="text-sm px-4 py-2 rounded-lg border border-[#9B4FDE]/40 text-[#E8E0F0] hover:border-[#9B4FDE] hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* ── Certificate Card ────────────────────────────────────────────── */}
        <div
          id="certificate"
          className="bg-white rounded-2xl text-gray-900 relative overflow-hidden"
          style={{ border: '6px solid #F59E0B' }}
        >
          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-r-0 border-b-0" style={{ borderTop: '4px solid #F59E0B', borderLeft: '4px solid #F59E0B', borderRadius: '16px 0 0 0' }} />
          <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: '4px solid #F59E0B', borderRight: '4px solid #F59E0B', borderRadius: '0 16px 0 0' }} />
          <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: '4px solid #F59E0B', borderLeft: '4px solid #F59E0B', borderRadius: '0 0 0 16px' }} />
          <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: '4px solid #F59E0B', borderRight: '4px solid #F59E0B', borderRadius: '0 0 16px 0' }} />

          <div className="px-12 py-14 text-center space-y-7">

            {/* Rotech branding */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-black tracking-tight" style={{ color: '#5a1f9a' }}>Rotech</span>
                <span className="text-2xl font-black tracking-tight" style={{ color: '#9B4FDE' }}>&#160;Data Consult</span>
              </div>
              <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            </div>

            {/* Title */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase font-semibold text-gray-400 mb-2">
                proudly presents
              </p>
              <h2
                className="text-3xl font-extrabold tracking-wide uppercase"
                style={{ color: '#1f2937' }}
              >
                Certificate of Completion
              </h2>
            </div>

            {/* Certifies that */}
            <p className="text-gray-400 text-sm italic">This is to certify that</p>

            {/* Student name */}
            <div>
              <p className="text-5xl font-extrabold" style={{ color: '#5a1f9a', fontFamily: 'Georgia, serif' }}>
                {profile?.full_name}
              </p>
              <div className="w-72 h-px mx-auto mt-3" style={{ backgroundColor: '#e5e7eb' }} />
            </div>

            <p className="text-gray-500 text-sm">has successfully completed the</p>

            {/* Domain */}
            <div className="space-y-1">
              <p className="text-5xl">{domain?.icon}</p>
              <p className="text-3xl font-extrabold text-gray-800">{domain?.title}</p>
              <p className="text-gray-400 text-sm tracking-wide uppercase text-xs">
                Data Analytics Programme
              </p>
            </div>

            {/* Score + Date */}
            <div className="flex justify-center gap-16 text-sm">
              <div className="text-center">
                <p className="text-2xl font-extrabold" style={{ color: '#5a1f9a' }}>{certificate.score}%</p>
                <p className="text-gray-400 text-xs mt-0.5 uppercase tracking-wide">Final Score</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-700">{issuedDate}</p>
                <p className="text-gray-400 text-xs mt-0.5 uppercase tracking-wide">Date Issued</p>
              </div>
            </div>

            {/* Verification code */}
            <div
              className="inline-block px-8 py-3 rounded-xl"
              style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}
            >
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">Verification Code</p>
              <p
                className="font-mono font-bold text-xl tracking-widest"
                style={{ color: '#5a1f9a' }}
              >
                {certificate.verification_code}
              </p>
            </div>

            {/* Footer note */}
            <p className="text-gray-300 text-xs">
              This certificate was issued by Rotech Data Consult and is verifiable using the code above.
            </p>

          </div>
        </div>

        {/* Share info — hidden on print */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-xl p-5 text-center space-y-2 print:hidden">
          <p className="text-sm text-white font-semibold">&#127881; Share Your Achievement</p>
          <p className="text-xs text-[#E8E0F0]">
            Employers can verify this certificate using code{' '}
            <span className="font-mono text-white font-bold">{certificate.verification_code}</span>.
            Use <strong>Print / Save PDF</strong> to download a copy.
          </p>
          <div className="flex gap-3 justify-center mt-3">
            <Link
              href={`/courses/${domainId}/exam`}
              className="text-xs text-[#C8D4E8] hover:text-white transition-colors"
            >
              Back to Exam &#8592;
            </Link>
            <span className="text-[#9B4FDE]">|</span>
            <Link
              href="/dashboard"
              className="text-xs text-[#C8D4E8] hover:text-white transition-colors"
            >
              Dashboard &#8594;
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
