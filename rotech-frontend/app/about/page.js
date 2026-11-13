import Link from 'next/link'
import PageShell from '@/components/marketing/PageShell'
import { Icon, Eyebrow, H2, BTN_PRIMARY } from '@/components/marketing/ui'
import { TRACKS } from '@/lib/tracks'
import Image from 'next/image'
import VideoCard from '@/components/marketing/VideoCard'
import TrainingSpace from '@/components/marketing/TrainingSpace'
import { SITE } from '@/lib/site'

export const metadata = {
  title: 'About Us',
  description: `${SITE.name} is a data consulting and training company in ${SITE.city}, ${SITE.countryName}. Our mission, vision and how we teach and work with organisations.`,
  alternates: { canonical: '/about' },
}

const PRINCIPLES = [
  { title: 'Practice before theory', body: 'Every week ends with something built: a workbook, a dashboard, a script, a working automation. Skills are shown, not claimed.' },
  { title: 'Local data, local problems', body: 'Exercises use Nigerian contexts: facility reports, shop sales, bank statements, NDPA 2023. What you learn fits where you work.' },
  { title: 'Small steps, steady pace', body: 'Tracks are split into phases and weeks so beginners are never lost and working professionals can keep up.' },
  { title: 'Honest about data', body: 'We teach data quality, privacy and ethics alongside tools, because a wrong number presented well is still wrong.' },
]

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Rotech Data Consult"
      title="We help people and organisations make their data useful"
      intro={`Rotech Data Consult is a data consulting and training company based in ${SITE.city}, ${SITE.countryName}. We teach practical data, AI and tech skills, and we build the dashboards, automations and reporting systems organisations rely on.`}
      crumbs={[['About']]}
    >
      <section className="px-5 py-16 text-ink sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-brand-200 bg-brand-50 p-8">
            <h2 className="font-display text-2xl font-extrabold text-brand-700">Our mission</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              To identify and strengthen the competencies of individuals and teams while fostering a collaborative learning ecosystem that simplifies and makes knowledge access inclusive.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-brand-200 bg-brand-50 p-8">
            <h2 className="font-display text-2xl font-extrabold text-brand-700">Our vision</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              To empower families, institutions, and businesses with the skills, tools, and ethical frameworks required to operate transparently, responsibly, and competitively within a data-driven economy.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-900 px-5 py-16 text-white sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow onDark>Our motto</Eyebrow>
          <h2 className={H2}>Monitor. Analyse. Thrive.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-100">
            Capture what is really happening, find out why, then act on it. The same three steps guide a learner building a first dashboard and a business fixing its reporting.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-brand-800 p-7">
              <h3 className="font-display text-xl font-extrabold">Rotech Academy</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                {TRACKS.length} instructor-led tracks from 8 to 16 weeks, taught in {SITE.city} and online, each ending with a capstone project and certificate.
              </p>
              <Link href="/programs" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sun-400 underline underline-offset-4">
                See the courses <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/15 bg-brand-800 p-7">
              <h3 className="font-display text-xl font-extrabold">Consulting and business tools</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                Dashboards, AI and workflow automation, monitoring and evaluation, corporate training, and a platform for data entry and instant analysis.
              </p>
              <Link href="/#business" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sun-400 underline underline-offset-4">
                See business services <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="founder-heading" className="px-5 py-16 text-ink sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <div aria-hidden="true" className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-sun-400" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-brand-600" />
            <div className="relative grid grid-cols-2 gap-4">
              <figure className="relative aspect-[9/16] overflow-hidden rounded-3xl shadow-xl shadow-brand-900/20 ring-4 ring-white">
                <Image src="/media/session-poster.jpg" alt={`${SITE.founder.name}, ${SITE.founder.role.toLowerCase()} of ${SITE.name}`} fill sizes="(min-width: 768px) 190px, 45vw" className="object-cover" />
              </figure>
              <VideoCard
                className="translate-y-6"
                src="/media/session.mp4"
                poster="/media/session-poster.jpg"
                title="Hear from the founder"
                duration="1 min 21 sec"
                alt={`${SITE.founder.name} presenting from a lectern`}
              />
            </div>
          </div>
          <div>
            <Eyebrow>Meet the founder</Eyebrow>
            <h2 id="founder-heading" className={H2}>{SITE.founder.name}</h2>
            <p className="mt-1 text-base font-bold text-brand-700">{SITE.founder.role}, {SITE.name}</p>
            <div className="mt-4 space-y-3">
              {SITE.founder.bio.map((para) => (
                <p key={para.slice(0, 30)} className="text-base leading-relaxed text-ink-soft">{para}</p>
              ))}
            </div>
            {SITE.founder.linkedin && (
              <a href={SITE.founder.linkedin} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-4">
                {SITE.founder.name} on LinkedIn <Icon name="arrow" className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      <TrainingSpace />

      <section className="px-5 py-16 text-ink sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>How we teach and work</Eyebrow>
          <h2 className={H2}>What you can expect from us</h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="rounded-3xl border-2 border-brand-100 bg-white p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={`mt-12 ${BTN_PRIMARY}`}>
            Get in touch
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
