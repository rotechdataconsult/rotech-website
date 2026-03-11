'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function friendlyError(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('wrong password'))
    return { text: 'Wrong email or password. Please try again.', hint: null }
  if (m.includes('email not confirmed') || m.includes('not confirmed'))
    return {
      text: 'Your email has not been confirmed yet.',
      hint: 'Please check your inbox for the confirmation email we sent when you registered. Check your spam folder too.',
    }
  if (m.includes('too many') || m.includes('rate limit'))
    return { text: 'Too many login attempts. Please wait a few minutes and try again.', hint: null }
  if (m.includes('user not found') || m.includes('no user'))
    return { text: 'No account found with this email. Would you like to register?', hint: null }
  if (m.includes('network') || m.includes('fetch'))
    return { text: 'Network error. Please check your connection and try again.', hint: null }
  return { text: 'Login failed. Please try again.', hint: null }
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null) // { text, hint }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email:    form.email,
        password: form.password,
      })

      if (authError) throw authError

      router.push('/dashboard')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#5a1f9a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-tight text-white">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">Login to continue your learning journey</p>
        </div>

        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required placeholder="you@example.com"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#E8E0F0]">Password</label>
                <Link href="/auth/forgot-password"
                  className="text-xs text-[#C8D4E8] hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                required placeholder="Enter your password"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Error message with optional hint */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 space-y-1">
                <div className="flex gap-2">
                  <span className="text-red-400 shrink-0">⚠</span>
                  <p className="text-red-400 text-sm">{error.text}</p>
                </div>
                {error.hint && (
                  <p className="text-[#C8D4E8] text-xs pl-5">{error.hint}</p>
                )}
                {error.text.includes('not been confirmed') && (
                  <p className="text-xs pl-5">
                    <Link href="/auth/forgot-password" className="text-[#9B4FDE] underline hover:text-white">
                      Resend confirmation email
                    </Link>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full font-semibold rounded-lg px-4 py-3 text-sm text-white transition-opacity duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#9B4FDE' }}>
              {loading ? <><Spinner /> Logging in...</> : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-[#C8D4E8] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium transition-colors" style={{ color: '#9B4FDE' }}>
              Create one free
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}
