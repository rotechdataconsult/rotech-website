'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('Password must be at least 6 characters and contain a letter and a number.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: form.password })
      if (updateError) throw updateError
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.')
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
          <h1 className="mt-4 text-3xl font-extrabold text-white">Set New Password</h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">Choose a strong new password.</p>
        </div>

        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              <ul className="mt-2 space-y-1">
                {[
                  { label: 'At least 6 characters', ok: form.password.length >= 6 },
                  { label: 'Contains a letter', ok: /[a-zA-Z]/.test(form.password) },
                  { label: 'Contains a number', ok: /[0-9]/.test(form.password) },
                ].map(({ label, ok }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs" style={{ color: ok ? '#86efac' : '#C8D4E8' }}>
                    <span>{ok ? '✓' : '○'}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
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
                  Updating...
                </>
              ) : 'Update Password'}
            </button>

            <p className="text-center text-sm text-[#C8D4E8] mt-2">
              <Link href="/auth/login" className="font-medium" style={{ color: '#9B4FDE' }}>
                Back to Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </main>
  )
}
