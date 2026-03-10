'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) throw authError

      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
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
          <h1 className="mt-4 text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="mt-1 text-[#E8E0F0] text-sm">Login to your Rotech account</p>
        </div>

        {/* Card */}
        <div className="bg-[#7B2FBE] border border-[#9B4FDE]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="jane@example.com"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#E8E0F0] mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C8D4E8] focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #9B4FDE'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-lg px-4 py-3 text-sm text-white transition-opacity duration-200 flex items-center justify-center gap-2 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#9B4FDE' }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.88' }}
              onMouseLeave={e => { e.target.style.opacity = '1' }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-4">
            <Link
              href="/auth/forgot-password"
              className="text-sm transition-colors"
              style={{ color: '#C8D4E8' }}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[#C8D4E8] mt-4">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium transition-colors"
              style={{ color: '#9B4FDE' }}
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}
