import Link from 'next/link'
import PageShell from '@/components/marketing/PageShell'
import { Icon, LevelBadge, BTN_SUN } from '@/components/marketing/ui'
import { TRACKS } from '@/lib/tracks'
import { SITE, whatsappLink } from '@/lib/site'

export const metadata = {
  title: 'Data, AI & Tech Courses in Abuja and Online',
  description: `All ${TRACKS.length} Rotech Academy courses: AI automation, Python, UI/UX design, public health data analytics, data analysis for accountants and engineers, and cyber security. Learn in Abuja or online.`,
  alternates: { canonical: '/programs' },
}

export default function ProgramsPage() {
  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rotech Academy courses',
    itemListElement: TRACKS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: `${SITE.url}${t.href}` })),
  }
  return (
    <PageShell
      eyebrow="Rotech Academy"
      title="Courses that lead to real work"
      intro={`${TRACKS.length} instructor-led tracks, from 8 to 16 weeks. Each one mixes live teaching with weekly practice and ends with a capstone project and certificate.`}
      crumbs={[['Courses']]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd).replace(/</g, '\\u003c') }} />
      <section className="px-5 py-16 text-ink sm:px-6 lg:py-20">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {TRACKS.map((t) => (
            <li key={t.slug}>
              <article className="flex h-full flex-col rounded-3xl border-2 border-brand-100 bg-white p-7 transition hover:border-brand-600 hover:shadow-xl hover:shadow-brand-900/10">
                <div className="flex items-start justify-between gap-3">
                  <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl">{t.icon}</span>
                  <LevelBadge level={t.level} />
                </div>
                <h2 className="mt-5 font-display text-2xl font-extrabold">
                  <Link href={t.href} className="hover:text-brand-700 hover:underline hover:underline-offset-4">{t.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.description}</p>
                <p className="mt-4 text-sm text-ink-soft"><span className="font-bold text-ink">For: </span>{t.who}</p>
                <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-ink-muted">
                  <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" />{t.duration}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon name="book" className="h-4 w-4" />{t.lessons}</span>
                </p>
                <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5" aria-label="Skills covered">
                  {t.skills.map((s) => <li key={s} className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-800">{s}</li>)}
                </ul>
                <Link href={t.href} aria-label={`View the ${t.title} syllabus`} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
                  View syllabus and enrol
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </article>
            </li>
          ))}
          <li>
            <div className="flex h-full flex-col justify-center rounded-3xl bg-brand-900 p-8 text-white">
              <h2 className="font-display text-2xl font-extrabold">Training a whole team?</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-100">
                We adapt any track for organisations, using your own data and schedule.
              </p>
              <a href={whatsappLink('Hello Rotech, I would like to discuss training for my team.')} target="_blank" rel="noopener noreferrer" className={`mt-6 self-start ${BTN_SUN}`}>
                <Icon name="chat" className="h-4 w-4" />
                Talk to us
              </a>
            </div>
          </li>
        </ul>
      </section>
    </PageShell>
  )
}
