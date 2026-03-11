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

// Map raw Supabase errors to friendly messages
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

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', domainTrack: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [registered, setRegistered] = useState(false) // show email confirmation screen

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

      // Show email confirmation screen instead of redirecting
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
      <main className="min-h-screen bg-[#5a1f9a] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <span className="text-2xl font-bold tracking-tight text-white">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>

          <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-10 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
              style={{ backgroundColor: '#9B4FDE33' }}>
              📧
            </div>
            <h2 className="text-xl font-extrabold text-white">Check Your Email</h2>
            <p className="text-[#E8E0F0] text-sm leading-relaxed">
              We sent a confirmation link to{' '}
              <span className="text-white font-semibold">{form.email}</span>.
            </p>
            <div className="bg-[#6B28A8] rounded-xl p-4 text-left space-y-2 text-sm text-[#E8E0F0]">
              <p className="font-semibold text-white">Next steps:</p>
              <p>1. Open your email inbox</p>
              <p>2. Find the email from Rotech Data Consult</p>
              <p>3. Click the <strong className="text-white">Confirm my account</strong> link</p>
              <p>4. Come back here and log in</p>
            </div>
            <p className="text-xs text-[#C8D4E8]">
              Did not receive it? Check your spam/junk folder.
            </p>
            <Link href="/auth/login"
              className="block w-full text-center font-semibold rounded-xl px-4 py-3 text-sm text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#9B4FDE' }}>
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#5a1f9a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-tight text-white">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Create Your Account</h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">Start your data analytics journey — it is free</p>
        </div>

        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Full Name *</label>
              <input
                type="text" name="fullName" value={form.fullName} onChange={handleChange}
                required placeholder="e.g. Chukwuemeka Obi"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Email Address *</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required placeholder="you@example.com"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Domain Track *</label>
              <select
                name="domainTrack" value={form.domainTrack} onChange={handleChange} required
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition appearance-none cursor-pointer"
                style={{ color: form.domainTrack ? 'white' : '#9ca3af' }}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              >
                <option value="" disabled>Select your area of interest</option>
                {DOMAIN_TRACKS.map(track => (
                  <option key={track} value={track} className="text-white bg-[#6B28A8]">{track}</option>
                ))}
              </select>
              <p className="text-xs text-[#C8D4E8] mt-1">You can change this later from your dashboard.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Password *</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                required minLength={6} placeholder="Min. 6 characters"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              <ul className="mt-2 space-y-1">
                {[
                  { label: 'At least 6 characters', ok: form.password.length >= 6 },
                  { label: 'Contains a letter',      ok: /[a-zA-Z]/.test(form.password) },
                  { label: 'Contains a number',      ok: /[0-9]/.test(form.password) },
                ].map(({ label, ok }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs"
                    style={{ color: ok ? '#86efac' : '#C8D4E8' }}>
                    <span>{ok ? '✓' : '○'}</span>{label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Confirm Password *</label>
              <input
                type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                required placeholder="Re-enter your password"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match.</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex gap-2">
                <span className="text-red-400 shrink-0">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full font-semibold rounded-lg px-4 py-3 text-sm text-white transition-opacity duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#9B4FDE' }}>
              {loading ? <><Spinner /> Creating account...</> : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#C8D4E8] mt-5 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-white transition-colors">
              Privacy & Data Protection Policy
            </Link>.
            Your data is protected under NDPR 2019.
          </p>

          <p className="text-center text-sm text-[#C8D4E8] mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium transition-colors" style={{ color: '#9B4FDE' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
