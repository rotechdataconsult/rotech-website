'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const DOMAIN_TRACKS = [
  'Fintech Analytics',
  'Healthcare Analytics',
  'E-commerce Analytics',
  'Supply Chain Analytics',
  'Climate & Energy Analytics',
]

function friendlyError(msg = '') {
  if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists'))
    return 'An account with this email already exists. Please login instead.'
  if (msg.toLowerCase().includes('invalid email'))
    return 'Please enter a valid email address.'
  if (msg.toLowerCase().includes('password'))
    return 'Password is too weak. Use at least 6 characters with a letter and a number.'
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch'))
    return 'Network error. Please check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

const INP = 'w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition'
const INP_STYLE = { backgroundColor: '#0F172A', border: '1px solid rgba(51,65,85,0.8)' }

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', domainTrack: '',
  })
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [registered, setRegistered] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) { setError('Please enter your full name.'); return }
    if (!form.domainTrack)     { setError('Please select a domain track.'); return }

    if (form.password.length < 6 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('Password must be at least 6 characters and contain a letter and a number.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
      })

      if (authError) throw authError

      const userId = authData.user?.id
      if (!userId) throw new Error('Registration failed. Please try again.')

      await supabase.from('users').insert({
        id:           userId,
        email:        form.email,
        full_name:    form.fullName,
        role:         'student',
        domain_track: form.domainTrack,
      })

      setRegistered(true)
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // ── Email confirmation screen ────────────────────────────────────────────────
  if (registered) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0F172A' }}>
        <div className="w-full max-w-md text-center space-y-6">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </Link>

          <div className="rounded-2xl p-10 shadow-2xl space-y-5" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
              style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
              &#128231;
            </div>
            <h2 className="text-xl font-extrabold text-white">Check Your Email</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We sent a confirmation link to{' '}
              <span className="text-white font-semibold">{form.email}</span>.
            </p>
            <div className="rounded-xl p-4 text-left space-y-2 text-sm text-slate-300" style={{ backgroundColor: '#0F172A' }}>
              <p className="font-semibold text-white">Next steps:</p>
              <p>1. Open your email inbox</p>
              <p>2. Find the email from Rotech Data Consult</p>
              <p>3. Click the <strong className="text-white">Confirm my account</strong> link</p>
              <p>4. Come back here and log in</p>
            </div>
            <p className="text-xs text-slate-500">
              Did not receive it? Check your spam/junk folder.
            </p>
            <Link href="/auth/login"
              className="block w-full text-center font-semibold rounded-xl px-4 py-3 text-sm text-white transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ backgroundColor: '#6C3FD4' }}>
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0F172A' }}>
      {/* Subtle purple glow */}
      <div className="fixed pointer-events-none" style={{ width: '600px', height: '600px', left: '-200px', bottom: '-200px', background: 'radial-gradient(circle, rgba(108,63,212,0.10) 0%, transparent 65%)', borderRadius: '50%' }} />

      <div className="w-full max-w-md relative">

        {/* Back to home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            &#8592; Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Create Your Account</h1>
          <p className="mt-1.5 text-sm text-slate-400">Start your data analytics journey — it is free</p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text" name="fullName" value={form.fullName} onChange={handleChange}
                required placeholder="e.g. Chukwuemeka Obi"
                className={INP} style={INP_STYLE}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B5CF6'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required placeholder="you@example.com"
                className={INP} style={INP_STYLE}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B5CF6'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Domain Track *</label>
              <select
                name="domainTrack" value={form.domainTrack} onChange={handleChange} required
                className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition appearance-none cursor-pointer"
                style={{ ...INP_STYLE, color: form.domainTrack ? 'white' : '#64748B' }}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B5CF6'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              >
                <option value="" disabled>Select your area of interest</option>
                {DOMAIN_TRACKS.map(track => (
                  <option key={track} value={track} style={{ backgroundColor: '#1E293B', color: 'white' }}>{track}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">You can change this later from your dashboard.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                required minLength={6} placeholder="Min. 6 characters"
                className={INP} style={INP_STYLE}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B5CF6'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              <ul className="mt-2 space-y-1">
                {[
                  { label: 'At least 6 characters', ok: form.password.length >= 6 },
                  { label: 'Contains a letter',      ok: /[a-zA-Z]/.test(form.password) },
                  { label: 'Contains a number',      ok: /[0-9]/.test(form.password) },
                ].map(({ label, ok }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs"
                    style={{ color: ok ? '#86efac' : '#64748B' }}>
                    <span>{ok ? '✓' : '○'}</span>{label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password *</label>
              <input
                type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                required placeholder="Re-enter your password"
                className={INP} style={INP_STYLE}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B5CF6'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match.</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex gap-2">
                <span className="text-red-400 shrink-0">&#9888;</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full font-semibold rounded-lg px-4 py-3 text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.01]"
              style={{ backgroundColor: '#6C3FD4' }}>
              {loading ? <><Spinner /> Creating account...</> : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-slate-300 transition-colors">
              Privacy &amp; Data Protection Policy
            </Link>.
            Your data is protected under NDPR 2019.
          </p>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-violet-400 hover:text-white transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
