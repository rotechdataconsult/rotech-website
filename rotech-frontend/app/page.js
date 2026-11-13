import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import LandingNavbar from '@/components/ui/LandingNavbar'
import ScrollReveal from '@/components/ui/ScrollReveal'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import TestimonialsSection from '@/components/ui/TestimonialsSection'
import { SITE, whatsappLink } from '@/lib/site'
import { TRACKS, trackHrefForTitle } from '@/lib/tracks'
import Footer from '@/components/marketing/Footer'
import TrainingSpace from '@/components/marketing/TrainingSpace'
import { Icon, LevelBadge, Eyebrow, H2, BTN_PRIMARY, BTN_SUN, BTN_GHOST_DARK } from '@/components/marketing/ui'

// ISR: revalidate every 5 minutes. Admin saves call /api/revalidate for instant update.
export const revalidate = 300

// ── Content ────────────────────────────────────────────────────────────────────
// Static fallbacks. Programs, impact numbers, testimonials and team come from
// the CMS tables when they have rows. Impact, testimonials and team are only
// shown when the CMS has real entries: we do not publish placeholder numbers,
// people or reviews.

// The 7 Academy tracks (lib/tracks.js), mirrored in rotech-tracks-seed.sql (lp_programs).
const DEFAULT_PROGRAMS = TRACKS

const HERO_FACTS = [
  [String(TRACKS.length), 'career tracks'],
  [String(TRACKS.reduce((n, t) => n + parseInt(t.lessons, 10), 0)), 'hands-on lessons'],
  ['2', 'ways to learn: Abuja or online'],
]

const STEPS = [
  {
    word: 'Monitor',
    title: 'Capture what is really happening',
    body: 'Record sales, expenses, stock, patients or programme results in a clean, structured way, instead of scattered notebooks and spreadsheets.',
  },
  {
    word: 'Analyse',
    title: 'Find out why it is happening',
    body: 'Use Excel, SQL, Power BI, Python and AI to see patterns, check quality, test ideas and catch problems early.',
  },
  {
    word: 'Thrive',
    title: 'Act on it with confidence',
    body: 'Turn findings into decisions, dashboards and automations that save time, cut losses and grow careers and businesses.',
  },
]

const BUSINESS_SERVICES = [
  { icon: 'chart',  title: 'Dashboards & reporting',  desc: 'Sales, finance and operations KPIs in one place, built in Power BI or on the Rotech platform.' },
  { icon: 'bolt',   title: 'AI & workflow automation', desc: 'Automate repetitive reports, reconciliations and follow-ups with tested, documented workflows.' },
  { icon: 'users',  title: 'Corporate training',       desc: 'Cohort training for your staff in Excel, Power BI, Python and AI, built around your own data.' },
  { icon: 'search', title: 'Data consulting',          desc: 'We design your data collection, quality checks and reporting process from the ground up.' },
  { icon: 'pencil', title: 'Structured data entry',    desc: 'Move from paper to clean digital records of sales, expenses and inventory, ready to analyse.' },
  { icon: 'pulse',  title: 'Monitoring & evaluation',  desc: 'Indicator tracking, surveys and evidence briefs for health, development and research programmes.' },
]

const FAQS = [
  {
    q: 'Do I need any experience to start?',
    a: 'No. The Beginner tracks (AI Automation, Python Programming, UI/UX Design and Cyber Security) start from zero. The Intermediate tracks for public health, accounting and engineering assume you already work in that field and are comfortable with basic Excel.',
  },
  {
    q: 'Are classes online or physical?',
    a: 'Both. You can join physical classes in Abuja or follow the same cohort virtually. Lessons, exercises, quizzes and projects live on the Rotech learning platform, so you can revise at any time.',
  },
  {
    q: 'How long does a course take?',
    a: 'Tracks run from 8 to 16 weeks depending on the subject. Each week combines taught sessions with hands-on exercises, and every track ends with a capstone project for your portfolio.',
  },
  {
    q: 'Will I get a certificate?',
    a: 'Yes. When you complete a track and pass its final assessment you receive a Rotech Data Consult certificate, plus the real projects you built along the way to show employers and clients.',
  },
  {
    q: 'How much does it cost?',
    a: 'Creating an account is free and gives you access to the platform’s free plan. Instructor-led cohorts are paid, and fees depend on the track. Message us on WhatsApp for current fees, dates and available slots.',
  },
  {
    q: 'Can Rotech train my team or work on my business data?',
    a: 'Yes. We run tailored training for organisations and take on consulting work such as dashboards, reporting systems, automation and monitoring and evaluation. Tell us what you need on WhatsApp and we will scope it with you.',
  },
  {
    q: 'What is the AI Analyst?',
    a: 'It is a tool on the Rotech platform. Upload a CSV or Excel file and it returns a data quality report, summary statistics, charts and plain-language insights, with no coding required.',
  },
]

// ── CMS Data Fetcher ───────────────────────────────────────────────────────────

async function fetchCMS() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    )
    const [
      { data: hero },
      { data: impact },
      { data: programs },
      { data: testimonials },
      { data: team },
    ] = await Promise.all([
      sb.from('lp_hero').select('*').maybeSingle(),
      sb.from('lp_impact_metrics').select('*').order('sort_order'),
      sb.from('lp_programs').select('*').eq('is_active', true).order('sort_order'),
      sb.from('lp_testimonials').select('*').eq('is_active', true).order('sort_order'),
      sb.from('lp_team').select('*').eq('is_active', true).order('sort_order'),
    ])
    return { hero, impact, programs, testimonials, team }
  } catch {
    // Tables may not exist yet — fall back to static data
    return { hero: null, impact: null, programs: null, testimonials: null, team: null }
  }
}

function normaliseSkills(skills) {
  if (Array.isArray(skills)) return skills
  if (typeof skills === 'string') return skills.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

// ── Structured data (JSON-LD) ──────────────────────────────────────────────────

function StructuredData({ programs }) {
  const org = {
    '@type': 'EducationalOrganization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/rotech-icon-512.png`,
    image: `${SITE.url}/opengraph-image.png`,
    description: SITE.description,
    slogan: SITE.motto,
    telephone: SITE.phoneE164,
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: SITE.country },
    areaServed: [{ '@type': 'Country', name: SITE.countryName }],
    sameAs: [SITE.instagram],
    founder: { '@type': 'Person', name: SITE.founder.name, jobTitle: SITE.founder.role, ...(SITE.founder.linkedin ? { sameAs: [SITE.founder.linkedin] } : {}) },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'admissions',
      telephone: SITE.phoneE164,
      availableLanguage: 'English',
    },
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: 'en-NG',
    publisher: { '@id': `${SITE.url}/#organization` },
  }
  const courses = {
    '@type': 'ItemList',
    name: 'Rotech Academy courses',
    itemListElement: programs.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: p.title,
        description: p.description,
        educationalLevel: p.level,
        url: `${SITE.url}${trackHrefForTitle(p.title) || '/programs'}`,
        provider: { '@id': `${SITE.url}/#organization` },
      },
    })),
  }
  const faq = {
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  const graph = { '@context': 'https://schema.org', '@graph': [org, website, courses, faq] }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  )
}

// ── Section: Hero ──────────────────────────────────────────────────────────────

const BARS = ['h-[38%]', 'h-[52%]', 'h-[44%]', 'h-[63%]', 'h-[55%]', 'h-[74%]', 'h-[68%]', 'h-[100%]']

function Hero({ data }) {
  const OLD_DEFAULT = 'Monitor. Analyse. Thrive.'
  const cmsHeadline = data?.headline && data.headline.trim() !== OLD_DEFAULT ? data.headline : null
  const subheadline =
    data?.subheadline && cmsHeadline
      ? data.subheadline
      : 'Rotech Data Consult trains people and teams in data analysis, Python, AI automation, design and cyber security, and helps Nigerian businesses turn everyday records into confident decisions.'
  const badge = cmsHeadline && data?.badge_text ? data.badge_text : 'Data, AI & tech academy · Abuja + online'

  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* Brand shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-600" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 right-32 h-[380px] w-[380px] rounded-full bg-brand-800" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-10 h-48 w-48 rounded-full border-[28px] border-brand-800" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-sun-400" aria-hidden="true" />
            {badge}
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            {cmsHeadline || (
              <>
                Data &amp; AI skills that work{' '}
                <span className="text-sun-400">as hard as you do.</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">{subheadline}</p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href={data?.cta_primary_href && cmsHeadline ? data.cta_primary_href : '#courses'} className={BTN_SUN}>
              {(cmsHeadline && data?.cta_primary_label) || 'Explore the courses'}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink('Hello Rotech, I would like to know more about your courses and services.')}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_GHOST_DARK}
            >
              <Icon name="chat" className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/20 pt-8">
            {HERO_FACTS.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-extrabold text-sun-400">{value}</span>
                  <span className="mt-1 block text-sm leading-snug text-brand-100">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Illustrative dashboard, decorative only */}
        <div aria-hidden="true" className="hidden lg:block">
          <div className="rotate-2 rounded-3xl bg-white p-6 text-ink shadow-2xl shadow-brand-950/50">
            <div className="flex items-center justify-between border-b border-brand-100 pb-4">
              <span className="text-sm font-bold">Monthly sales</span>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">Sample dashboard</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[['Revenue', '₦2.4M', '▲ 12%'], ['Orders', '1,204', '▲ 8%'], ['Data quality', '94%', '▲ 3%']].map(([label, value, change]) => (
                <div key={label} className="rounded-xl bg-brand-50 p-3">
                  <p className="text-xs text-ink-muted">{label}</p>
                  <p className="mt-0.5 font-display text-xl font-extrabold">{value}</p>
                  <p className="text-xs font-bold text-brand-700">{change}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex h-36 items-end gap-2 rounded-xl bg-brand-50 p-4">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-md ${h} ${i === BARS.length - 1 ? 'bg-sun-400 ring-2 ring-ink' : 'bg-brand-600'}`}
                />
              ))}
            </div>
            <div className="mt-4 flex gap-3 rounded-xl bg-brand-900 p-4 text-white">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sun-400 text-ink">
                <Icon name="bolt" className="h-4 w-4" />
              </span>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-sun-400">AI insight: </span>
                August was your best month. Restock your top three items before the next peak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Monitor · Analyse · Thrive ────────────────────────────────────────

function MottoSteps() {
  return (
    <section id="how" className="bg-white px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className={H2}>Monitor. Analyse. Thrive.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Three steps sit behind everything we teach and build, whether you are starting a career or running a business.
            </p>
          </div>
        </ScrollReveal>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.word}>
              <ScrollReveal delay={i * 120} className="h-full">
                <div className="relative h-full rounded-3xl border-2 border-brand-100 bg-brand-50 p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-extrabold text-white">
                    {i + 1}
                  </span>
                  <p className="mt-6 font-display text-2xl font-extrabold text-brand-700">{step.word}</p>
                  <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ── Section: Who it is for ─────────────────────────────────────────────────────

function Audiences() {
  const cards = [
    {
      title: 'For learners and career changers',
      body: 'Structured, instructor-led tracks that take you from the basics to a portfolio of real projects and a certificate.',
      points: ['Beginner-friendly, step by step', 'Physical classes in Abuja or virtual', 'Projects built on Nigerian data'],
      cta: 'See the courses', href: '#courses', dark: false,
    },
    {
      title: 'For businesses and organisations',
      body: 'Dashboards, automation, staff training and consulting that turn the records you already keep into better decisions.',
      points: ['Dashboards and reporting systems', 'AI and workflow automation', 'Tailored training for your team'],
      cta: 'See business services', href: '#business', dark: true,
    },
  ]
  return (
    <section className="bg-brand-50 px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Eyebrow>Who we work with</Eyebrow>
            <h2 className={H2}>Two ways Rotech can help you</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 120} className="h-full">
              <div className={`flex h-full flex-col rounded-3xl p-8 sm:p-10 ${c.dark ? 'bg-brand-900 text-white' : 'border-2 border-brand-200 bg-white'}`}>
                <h3 className="font-display text-2xl font-extrabold">{c.title}</h3>
                <p className={`mt-3 text-base leading-relaxed ${c.dark ? 'text-brand-100' : 'text-ink-soft'}`}>{c.body}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.dark ? 'bg-sun-400 text-ink' : 'bg-brand-600 text-white'}`}>
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <a href={c.href} className={`mt-8 self-start ${c.dark ? BTN_SUN : BTN_PRIMARY}`}>
                  {c.cta}
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Courses ───────────────────────────────────────────────────────────

function CoursesSection({ programs }) {
  return (
    <section id="courses" className="bg-white px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Rotech Academy</Eyebrow>
            <h2 className={H2}>Data, AI and tech courses built for real jobs</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {programs.length} instructor-led tracks. Every week mixes teaching with practice, and every track ends with a capstone project.
            </p>
          </div>
        </ScrollReveal>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((course, i) => (
            <li key={course.id ?? course.title}>
              <ScrollReveal delay={(i % 3) * 100} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border-2 border-brand-100 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-600 hover:shadow-xl hover:shadow-brand-900/10">
                  <div className="flex items-start justify-between gap-3">
                    <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
                      {course.icon}
                    </span>
                    <LevelBadge level={course.level || 'Beginner'} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{course.description}</p>

                  <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-ink-muted">
                    {course.duration && (
                      <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" />{course.duration}</span>
                    )}
                    {course.lessons && (
                      <span className="inline-flex items-center gap-1.5"><Icon name="book" className="h-4 w-4" />{course.lessons}</span>
                    )}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills covered">
                    {normaliseSkills(course.skills).map((skill) => (
                      <li key={skill} className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-800">{skill}</li>
                    ))}
                  </ul>

                  <Link
                    href={trackHrefForTitle(course.title) || course.cta_href || '/auth/register'}
                    aria-label={`View the ${course.title} syllabus and enrol`}
                    className={`mt-6 w-full ${BTN_PRIMARY}`}
                  >
                    View syllabus
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </article>
              </ScrollReveal>
            </li>
          ))}

          <li>
            <ScrollReveal delay={200} className="h-full">
              <div className="flex h-full min-h-[280px] flex-col justify-center rounded-3xl bg-sun-400 p-8 text-ink">
                <h3 className="font-display text-2xl font-extrabold">Not sure which track fits?</h3>
                <p className="mt-3 text-sm leading-relaxed">
                  Tell us where you are now and where you want to get to. We will recommend a starting point.
                </p>
                <a
                  href={whatsappLink('Hello Rotech, I need help choosing the right course.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-900"
                >
                  <Icon name="chat" className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </li>
        </ul>
      </div>
    </section>
  )
}

// ── Section: Business ──────────────────────────────────────────────────────────

function BusinessSection() {
  return (
    <section id="business" className="bg-brand-900 px-5 py-20 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Eyebrow onDark>For businesses and organisations</Eyebrow>
              <h2 className={H2}>From paper records to decisions you can defend</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100">
                We work with SMEs, health programmes, finance teams and NGOs to capture clean data, see what it says and act on it.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <a
                href={whatsappLink('Hello Rotech, I would like to discuss data support for my organisation.')}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_SUN}
              >
                <Icon name="chat" className="h-4 w-4" />
                Book a free consultation
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_SERVICES.map((f, i) => (
            <li key={f.title}>
              <ScrollReveal delay={(i % 3) * 80} className="h-full">
                <div className="h-full rounded-3xl border border-white/15 bg-brand-800 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sun-400 text-ink">
                    <Icon name={f.icon} />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-100">{f.desc}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Section: Platform tools ────────────────────────────────────────────────────

function ToolsSection() {
  const tools = [
    {
      icon: 'upload',
      title: 'AI Analyst',
      lead: 'Instant analysis, no code required.',
      body: 'Upload a CSV or Excel file and get a data quality report, summary statistics, charts and plain-language insights in minutes.',
      points: ['Automatic cleaning and quality score', 'Statistics and outlier detection', 'Charts generated for you', 'Insights written in plain English'],
      cta: 'Try the AI Analyst',
    },
    {
      icon: 'pencil',
      title: 'Data Entry',
      lead: 'Still keeping records on paper?',
      body: 'Record daily sales, expenses and inventory straight into the platform, then export to CSV or send it to the AI Analyst.',
      points: ['Sales with product, quantity and payment method', 'Expenses by category', 'Inventory with low-stock alerts', 'One-click export for analysis'],
      cta: 'Start recording',
    },
  ]
  return (
    <section id="tools" className="bg-white px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>On the Rotech platform</Eyebrow>
            <h2 className={H2}>Tools that put your data to work today</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Included with a free account, alongside your courses.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tools.map((t, i) => (
            <ScrollReveal key={t.title} delay={i * 120} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border-2 border-brand-100 bg-brand-50 p-8 sm:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Icon name={t.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold">{t.title}</h3>
                <p className="mt-1 text-base font-bold text-brand-700">{t.lead}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.body}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className={`mt-8 self-start ${BTN_PRIMARY}`}>
                  {t.cta}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Impact (CMS only) ─────────────────────────────────────────────────

function ImpactSection({ stats }) {
  return (
    <section className="bg-brand-600 px-5 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="sr-only">Our impact in numbers</h2>
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.id ?? stat.label ?? i}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-5xl font-extrabold text-white">
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="mt-2 block text-sm font-semibold text-brand-100">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ── Section: Team (CMS only) ───────────────────────────────────────────────────

function TeamSection({ team }) {
  return (
    <section id="team" className="bg-white px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Our team</Eyebrow>
            <h2 className={H2}>The people behind Rotech</h2>
          </div>
        </ScrollReveal>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <li key={member.id ?? member.name}>
              <ScrollReveal delay={i * 100} className="h-full">
                <div className="flex h-full flex-col items-center gap-4 rounded-3xl border-2 border-brand-100 bg-white p-6 text-center">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo_url} alt={`${member.name}, ${member.role}`} loading="lazy" className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-100" />
                  ) : (
                    <span aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 font-display text-2xl font-extrabold text-white">
                      {member.initials || member.name?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1">
                    <h3 className="text-base font-bold">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-bold text-brand-700">{member.role}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{member.bio}</p>
                  </div>
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-700 underline underline-offset-4">
                      {member.name} on LinkedIn
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Section: About ─────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="bg-brand-50 px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Eyebrow>About Rotech Data Consult</Eyebrow>
            <h2 className={H2}>Built on purpose, based in Abuja</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              We are a data consulting and training company. We teach practical skills and build data systems for people and organisations across Nigeria.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ScrollReveal className="h-full">
            <div className="h-full rounded-3xl border-2 border-brand-200 bg-white p-8">
              <h3 className="font-display text-xl font-extrabold text-brand-700">Our mission</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                To identify and strengthen the competencies of individuals and teams while fostering a collaborative learning ecosystem that simplifies and makes knowledge access inclusive.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="h-full">
            <div className="h-full rounded-3xl border-2 border-brand-200 bg-white p-8">
              <h3 className="font-display text-xl font-extrabold text-brand-700">Our vision</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                To empower families, institutions, and businesses with the skills, tools, and ethical frameworks required to operate transparently, responsibly, and competitively within a data-driven economy.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ── Section: FAQ ───────────────────────────────────────────────────────────────

function FAQ() {
  return (
    <section id="faq" className="bg-white px-5 py-20 text-ink sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <Eyebrow>Questions</Eyebrow>
          <h2 className={H2}>Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border-2 border-brand-100 bg-white open:border-brand-600 open:bg-brand-50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-bold [&::-webkit-details-marker]:hidden">
                <h3>{q}</h3>
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold leading-none text-white transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Final CTA ─────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="bg-white px-5 pb-20 sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-600 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand-800" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Ready to make your data <span className="text-sun-400">work for you?</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-100">
            Create a free account to explore the platform, or talk to us about the next cohort and what your team needs.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register" className={`w-full sm:w-auto ${BTN_SUN}`}>
              Create a free account
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink('Hello Rotech, I would like to know more.')}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto ${BTN_GHOST_DARK}`}
            >
              <Icon name="chat" className="h-4 w-4" />
              WhatsApp {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const cms = await fetchCMS()

  const programs     = cms?.programs?.length     ? cms.programs     : DEFAULT_PROGRAMS
  const impactStats  = cms?.impact?.length       ? cms.impact       : null
  const testimonials = cms?.testimonials?.length ? cms.testimonials : null
  const team         = cms?.team?.length         ? cms.team         : null

  return (
    <div className="bg-white">
      <StructuredData programs={programs} />
      <LandingNavbar />
      <main id="main">
        <Hero data={cms?.hero} />
        <MottoSteps />
        <Audiences />
        <CoursesSection programs={programs} />
        <TrainingSpace />
        {impactStats && <ImpactSection stats={impactStats} />}
        <BusinessSection />
        <ToolsSection />
        {testimonials && <TestimonialsSection testimonials={testimonials} />}
        <About />
        {team && <TeamSection team={team} />}
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
