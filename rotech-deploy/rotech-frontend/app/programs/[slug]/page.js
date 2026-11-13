import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/marketing/PageShell'
import EnquiryForm from '@/components/marketing/EnquiryForm'
import { Icon, LevelBadge, Eyebrow, H2, BTN_PRIMARY, BTN_SUN } from '@/components/marketing/ui'
import { TRACKS, getTrack, formatCohortDate } from '@/lib/tracks'
import { SITE } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) return {}
  const title = `${track.title} Course in Abuja & Online`
  const description = `${track.description} ${track.duration}, ${track.level.toLowerCase()} level, physical classes in Abuja or online, with a capstone project and certificate.`
  return {
    title,
    description,
    alternates: { canonical: track.href },
    openGraph: { title: `${title} | ${SITE.name}`, description, url: track.href, type: 'website' },
  }
}

function courseFaqs(track) {
  const beginner = track.level === 'Beginner'
  return [
    {
      q: `Who is the ${track.title} course for?`,
      a: `${track.who} ${beginner ? 'It starts from the basics, so no previous experience is required.' : 'It assumes you already work or have studied in this field and are comfortable with basic Excel.'}`,
    },
    {
      q: 'How is the course delivered?',
      a: `It runs for ${track.weeks} weeks with ${track.sessionsPerWeek} live sessions a week. You can attend physical classes in Abuja or join the same cohort online. Notes, exercises and quizzes stay on the Rotech platform for revision.`,
    },
    {
      q: 'What will I have at the end?',
      a: `A finished capstone project, the weekly deliverables you built along the way, and: ${track.certificates.join('; ')}.`,
    },
    {
      q: 'How much does it cost and when does it start?',
      a: track.fee && track.nextCohort
        ? `The fee is ${track.fee} and the next cohort starts on ${formatCohortDate(track.nextCohort)}. Message us on WhatsApp to reserve a seat.`
        : `Fees and start dates are set per cohort. Send an enquiry from this page or message us on WhatsApp (${SITE.phoneDisplay}) for the current fee, payment options and next start date.`,
    },
  ]
}

function StructuredData({ track, faqs }) {
  const course = {
    '@type': 'Course',
    '@id': `${SITE.url}${track.href}#course`,
    name: track.title,
    description: track.description,
    url: `${SITE.url}${track.href}`,
    courseCode: track.code,
    educationalLevel: track.level,
    inLanguage: 'en',
    teaches: track.skills,
    audience: { '@type': 'Audience', audienceType: track.who },
    educationalCredentialAwarded: track.certificates[0],
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['Onsite', 'Online'],
      courseWorkload: `P${track.weeks}W`,
      location: { '@type': 'Place', name: `${SITE.name}, ${SITE.city}`, address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: SITE.country } },
      ...(track.nextCohort ? { startDate: track.nextCohort } : {}),
    },
  }
  const faq = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [course, faq] }).replace(/</g, '\\u003c') }}
    />
  )
}

export default async function ProgramPage({ params }) {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) notFound()

  const faqs = courseFaqs(track)
  const others = TRACKS.filter((t) => t.slug !== track.slug).slice(0, 3)
  const facts = [
    ['clock', 'Duration', `${track.weeks} weeks, ${track.sessionsPerWeek} live sessions a week`],
    ['users', 'Format', 'Physical class in Abuja or online'],
    ['book', 'Content', `${track.lessons} and a capstone project`],
    ['check', 'Next cohort', track.nextCohort ? formatCohortDate(track.nextCohort) : 'Ask us for the next start date'],
    ['chart', 'Fee', track.fee || 'Ask us for the current fee'],
  ]

  return (
    <PageShell
      eyebrow="Rotech Academy course"
      title={track.title}
      intro={track.description}
      crumbs={[['Courses', '/programs'], [track.title]]}
      banner={
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LevelBadge level={track.level} />
          <a href="#enquire" className={BTN_SUN}>
            Reserve a seat
            <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a href="#syllabus" className="text-sm font-bold text-white underline underline-offset-4 hover:text-sun-400">
            See the weekly syllabus
          </a>
        </div>
      }
    >
      <StructuredData track={track} faqs={faqs} />

      {/* Key facts */}
      <section aria-label="Course facts" className="border-b-2 border-brand-100 bg-brand-50 px-5 py-8 text-ink sm:px-6">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map(([icon, label, value]) => (
            <div key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon name={icon} className="h-4 w-4" />
              </span>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-brand-700">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold leading-snug">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-16 text-ink sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:py-20">
        <div className="space-y-16">

          {/* Who + outcomes */}
          <section aria-labelledby="who-heading">
            <Eyebrow>Is this for you?</Eyebrow>
            <h2 id="who-heading" className={H2}>Who this course is for</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{track.who}</p>

            <h3 className="mt-8 text-base font-bold">Roles it prepares you for</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {track.roles.map((r) => (
                <li key={r} className="rounded-full border-2 border-brand-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand-800">{r}</li>
              ))}
            </ul>

            <h3 className="mt-8 text-base font-bold">Tools you will use</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {track.tools.map((t) => (
                <li key={t} className="rounded-md bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800">{t}</li>
              ))}
            </ul>
          </section>

          {/* Problems it solves */}
          {track.answers.length > 0 && (
            <section aria-labelledby="why-heading">
              <Eyebrow>Why it is built this way</Eyebrow>
              <h2 id="why-heading" className={H2}>Real problems this course answers</h2>
              <ul className="mt-6 space-y-3">
                {track.answers.map(({ problem, answer }) => (
                  <li key={problem} className="rounded-2xl border-2 border-brand-100 bg-white p-5">
                    <p className="text-sm font-bold">
                      <span className="mr-2 text-xs uppercase tracking-wider text-brand-700">The problem:</span>
                      {problem}
                    </p>
                    {answer && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        <span className="mr-2 text-xs font-bold uppercase tracking-wider text-brand-700">Our answer:</span>
                        {answer.charAt(0).toUpperCase() + answer.slice(1)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Syllabus */}
          <section id="syllabus" aria-labelledby="syllabus-heading">
            <Eyebrow>Week by week</Eyebrow>
            <h2 id="syllabus-heading" className={H2}>{track.title} syllabus</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {track.weeks} weeks in {track.phases.length} phases. Every week ends with something you have built.
            </p>

            <div className="mt-8 space-y-10">
              {track.phases.map((phase, pi) => (
                <div key={phase.name}>
                  <h3 className="flex items-center gap-3 font-display text-xl font-extrabold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun-400 text-sm text-ink">{pi + 1}</span>
                    <span><span className="sr-only">Phase {pi + 1}: </span>{phase.name}</span>
                  </h3>
                  <div className="mt-4 space-y-3">
                    {phase.weeks.map((w) => (
                      <details key={w.number} className="group rounded-2xl border-2 border-brand-100 bg-white open:border-brand-600 open:bg-brand-50">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                          <h4 className="text-sm font-bold sm:text-base">
                            <span className="mr-2 text-brand-700">Week {w.number}</span>
                            {w.title}
                          </h4>
                          <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold leading-none text-white transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <div className="px-5 pb-5">
                          <ul className="space-y-2">
                            {w.topics.map((topic) => (
                              <li key={topic} className="flex items-start gap-3 text-sm text-ink-soft">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                                  <Icon name="check" className="h-3 w-3" />
                                </span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                          {w.deliverable && (
                            <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm ring-2 ring-brand-200">
                              <span className="font-bold text-brand-700">You build: </span>
                              {w.deliverable}
                            </p>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Capstone + certificate */}
          <section aria-labelledby="capstone-heading" className="rounded-3xl bg-brand-900 p-8 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun-400">Capstone project</p>
            <h2 id="capstone-heading" className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">How you finish</h2>
            <p className="mt-4 text-base leading-relaxed text-brand-100">{track.capstone}</p>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-sun-400">What you earn</h3>
            <ul className="mt-3 space-y-2">
              {track.certificates.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm font-medium">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sun-400 text-ink">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="faq-heading" className={H2}>About this course</h2>
            <div className="mt-6 space-y-3">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group rounded-2xl border-2 border-brand-100 bg-white open:border-brand-600 open:bg-brand-50">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-bold [&::-webkit-details-marker]:hidden">
                    <h3>{q}</h3>
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold leading-none text-white transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Enquiry */}
        <aside id="enquire" className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm
            topics={TRACKS.map((t) => t.title)}
            defaultTopic={track.title}
            heading="Reserve a seat or ask a question"
          />
          <p className="mt-4 text-center text-sm text-ink-muted">
            Already decided?{' '}
            <Link href="/auth/register" className="font-bold text-brand-700 underline underline-offset-4">Create your free account</Link>
          </p>
        </aside>
      </div>

      {/* Other courses */}
      <section aria-labelledby="more-heading" className="bg-brand-50 px-5 py-16 text-ink sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 id="more-heading" className={H2}>Other courses you might like</h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {others.map((t) => (
              <li key={t.slug}>
                <Link href={t.href} className="flex h-full flex-col rounded-3xl border-2 border-brand-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-600">
                  <span aria-hidden="true" className="text-2xl">{t.icon}</span>
                  <span className="mt-3 font-display text-lg font-extrabold">{t.title}</span>
                  <span className="mt-1 text-sm text-ink-muted">{t.duration} · {t.level}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-4">
                    View course <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/programs" className={`mt-10 ${BTN_PRIMARY}`}>
            See all courses
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
