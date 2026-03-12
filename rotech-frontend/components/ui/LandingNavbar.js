'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingNavbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [darkMode,  setDarkMode]  = useState(true)   // default: dark (matches site theme)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('rotech-theme')
    if (saved) setDarkMode(saved === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('rotech-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const navLinks = [
    ['#path',     'Programs'],
    ['#courses',  'Courses'],
    ['#analyst',  'AI Analyst'],
    ['#business', 'Business'],
  ]

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(15,23,42,0.97)' : 'rgba(15,23,42,0.6)',
        borderBottom: scrolled ? '1px solid rgba(51,65,85,0.8)' : '1px solid transparent',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
          Rotech{' '}
          <span style={{ color: '#8B5CF6' }}>Data Consult</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map(([href, label]) => (
            <a
              key={label}
              href={href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
          <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        {/* Auth buttons + theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="h-8 w-8 rounded-full flex items-center justify-center border transition-colors"
            style={{ borderColor: 'rgba(100,116,139,0.4)', color: '#CBD5E1' }}
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link
            href="/auth/login"
            className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
            style={{ color: '#CBD5E1', borderColor: 'rgba(100,116,139,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.borderColor = 'rgba(100,116,139,0.4)' }}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-bold px-5 py-2 rounded-lg text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: '#6C3FD4' }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: '#CBD5E1' }}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 space-y-1 border-t"
          style={{ backgroundColor: 'rgba(15,23,42,0.98)', borderColor: 'rgba(51,65,85,0.6)' }}
        >
          {navLinks.map(([href, label]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <div className="flex gap-3 pt-3">
            <Link
              href="/auth/login"
              className="flex-1 text-center text-sm font-medium py-2.5 rounded-lg border transition-colors text-slate-300 hover:text-white"
              style={{ borderColor: 'rgba(100,116,139,0.5)' }}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="flex-1 text-center text-sm font-bold py-2.5 rounded-lg text-white"
              style={{ backgroundColor: '#6C3FD4' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
