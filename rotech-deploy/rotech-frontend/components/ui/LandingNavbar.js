'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  ['/programs',  'Courses'],
  ['/#business', 'For Business'],
  ['/#tools',    'AI Tools'],
  ['/about',     'About'],
  ['/pricing',   'Pricing'],
  ['/contact',   'Contact'],
]

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_0_#DCCFF2,0_8px_24px_-12px_rgba(47,11,96,0.25)]' : ''
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 sm:px-6">
        <Link href="/" aria-label="Rotech Data Consult, home" className="shrink-0">
          <Image
            src="/brand/rotech-wordmark.png"
            alt="Rotech Data Consult"
            width={720}
            height={214}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <ul className="hidden items-center gap-7 text-sm font-semibold text-ink-soft lg:flex">
          {NAV_LINKS.map(([href, label]) => (
            <li key={label}>
              <Link
                href={href}
                className="underline-offset-8 decoration-2 decoration-brand-600 transition-colors hover:text-brand-700 hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand-900 lg:hidden"
          onClick={() => setMenuOpen((m) => !m)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-brand-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          <ul className="divide-y divide-brand-100">
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3.5 text-base font-semibold text-ink"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            <Link
              href="/auth/login"
              className="flex-1 rounded-full border-2 border-brand-600 py-3 text-center text-sm font-bold text-brand-700"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="flex-1 rounded-full bg-brand-600 py-3 text-center text-sm font-bold text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
