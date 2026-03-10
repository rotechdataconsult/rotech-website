'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://rotech-website-production-7cb7.up.railway.app/auth/reset-password',
      })

      if (resetError) throw resetError

      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#5a1f9a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-tight text-white">
            Rotech <span style={{ color: '#C8D4E8' }}>Data Consult</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Reset Password</h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">
            {sent ? 'Check your email for a reset link.' : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#9B4FDE' }}>
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white text-sm">
                We sent a password reset link to <span className="font-semibold">{email}</span>.
                Check your inbox (and spam folder).
              </p>
              <Link
                href="/auth/login"
                className="block w-full text-center font-semibold rounded-lg px-4 py-3 text-sm text-white mt-4"
                style={{ backgroundColor: '#9B4FDE' }}
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  required
                  placeholder="jane@example.com"
                  className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                  onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold rounded-lg px-4 py-3 text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#9B4FDE' }}
                onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.88' }}
                onMouseLeave={e => { e.target.style.opacity = '1' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-[#C8D4E8] mt-2">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-medium" style={{ color: '#9B4FDE' }}>
                  Login
                </Link>
              </p>
            </form>
          )}
        </div>

      </div>
    </main>
  )
}
