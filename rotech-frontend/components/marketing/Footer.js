import Link from 'next/link'
import Image from 'next/image'
import { SITE } from '@/lib/site'

// ── Section: Footer ────────────────────────────────────────────────────────────

export default function Footer() {
  const columns = {
    Learn:    [['All courses', '/programs'], ['How we work', '/#how'], ['Pricing', '/pricing'], ['FAQ', '/#faq']],
    Business: [['Business services', '/#business'], ['AI Analyst', '/#tools'], ['Data Entry', '/#tools'], ['Team training', '/contact']],
    Company:  [['About us', '/about'], ['Contact', '/contact'], ['Terms of use', '/terms'], ['Privacy policy', '/privacy'], ['Log in', '/auth/login']],
  }
  return (
    <footer className="bg-brand-950 px-5 py-14 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/brand/rotech-wordmark-white.png" alt="Rotech Data Consult" width={720} height={214} className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
              {SITE.motto} Data, AI and tech training and business analytics from {SITE.city}, {SITE.countryName}.
            </p>
            <address className="mt-5 space-y-2 text-sm not-italic text-brand-100">
              <p>{SITE.city}, {SITE.countryName}</p>
              <p>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4 hover:text-sun-400">
                  WhatsApp {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4 hover:text-sun-400">
                  Instagram {SITE.instagramHandle}
                </a>
              </p>
            </address>
          </div>
          {Object.entries(columns).map(([heading, items]) => (
            <nav key={heading} aria-label={heading}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-sun-400">{heading}</h2>
              <ul className="space-y-2.5 text-sm text-brand-100">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="underline-offset-4 hover:text-white hover:underline">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-brand-200 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="font-semibold">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  )
}

