import Link from 'next/link'
import LandingNavbar from '@/components/ui/LandingNavbar'
import Footer from '@/components/marketing/Footer'
import { SITE } from '@/lib/site'

/**
 * Shared frame for public marketing pages: header, purple page banner with
 * breadcrumbs, content, footer. Also emits BreadcrumbList structured data.
 *
 * crumbs: [['Courses', '/programs'], ['Python Programming']]  (last has no href)
 */
export default function PageShell({ eyebrow, title, intro, crumbs = [], banner, children }) {
  const trail = [['Home', '/'], ...crumbs]
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, href], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(href ? { item: `${SITE.url}${href === '/' ? '' : href}` } : {}),
    })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      <LandingNavbar />
      <main id="main">
        <section className="relative overflow-hidden bg-brand-900 px-5 py-14 text-white sm:px-6 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-600" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-40 h-[300px] w-[300px] rounded-full bg-brand-800" />
          <div className="relative mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-brand-200">
                {trail.map(([name, href], i) => (
                  <li key={name} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {href ? (
                      <Link href={href} className="underline underline-offset-4 hover:text-white">{name}</Link>
                    ) : (
                      <span aria-current="page" className="text-white">{name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {eyebrow && <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-sun-400">{eyebrow}</p>}
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
            {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">{intro}</p>}
            {banner}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  )
}
