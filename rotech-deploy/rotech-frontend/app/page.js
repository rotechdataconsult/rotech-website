import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import LandingNavbar from '@/components/ui/LandingNavbar'
import QuoteRotator from '@/components/ui/QuoteRotator'
import ScrollReveal from '@/components/ui/ScrollReveal'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import TestimonialsSection from '@/components/ui/TestimonialsSection'

// ISR: revalidate every 5 minutes. Admin saves call /api/revalidate for instant update.
export const revalidate = 300

// ── Design Tokens ──────────────────────────────────────────────────────────────
const T = {
  dark:        '#0F172A',
  darkMid:     '#1E293B',
  darkBorder:  '#334155',
  light:       '#F8FAFC',
  white:       '#FFFFFF',
  blueBg:      '#F0F9FF',
  purple:      '#6C3FD4',
  purpleLight: '#8B5CF6',
  purpleSoft:  'rgba(108,63,212,0.1)',
  teal:        '#0EA5E9',
  green:       '#10B981',
  amber:       '#F59E0B',
  textDark:    '#0F172A',
  textMid:     '#334155',
  textMuted:   '#64748B',
  textSoft:    '#CBD5E1',
}

// ── Static fallback data (used when CMS tables are empty) ──────────────────────

const DEFAULT_PROGRAMS = [
  {
    id: 1, title: 'Excel for Data Analysis',
    description: 'Master pivot tables, VLOOKUP, and dashboards — the foundation every analyst needs.',
    icon: '📊', icon_bg: '#DCFCE7', icon_color: '#16A34A',
    level: 'Beginner', duration: '4 weeks', lessons: '18 lessons',
    skills: ['Pivot Tables', 'VLOOKUP', 'Charts', 'Dashboards'],
  },
  {
    id: 2, title: 'SQL for Data Analysis',
    description: 'Write queries to extract, filter, join, and aggregate data from relational databases.',
    icon: '🗄️', icon_bg: '#DBEAFE', icon_color: '#1D4ED8',
    level: 'Beginner', duration: '5 weeks', lessons: '22 lessons',
    skills: ['SELECT & JOIN', 'Aggregations', 'Subqueries', 'Indexes'],
  },
  {
    id: 3, title: 'Power BI Dashboards',
    description: 'Build interactive dashboards, connect to live data sources, and share insights visually.',
    icon: '📈', icon_bg: '#FEF9C3', icon_color: '#CA8A04',
    level: 'Intermediate', duration: '6 weeks', lessons: '24 lessons',
    skills: ['DAX Formulas', 'Data Modeling', 'Visuals', 'Reports'],
  },
  {
    id: 4, title: 'Python for Data Analysis',
    description: 'Use Pandas, NumPy, and Matplotlib to analyse and visualise datasets at scale.',
    icon: '🐍', icon_bg: '#EDE9FE', icon_color: '#7C3AED',
    level: 'Intermediate', duration: '8 weeks', lessons: '30 lessons',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Data Cleaning'],
  },
  {
    id: 5, title: 'AI Tools for Data Analysts',
    description: 'Use ChatGPT, Claude, and AI tools to accelerate your workflow — the future of data.',
    icon: '🤖', icon_bg: '#FCE7F3', icon_color: '#BE185D',
    level: 'Advanced', duration: '4 weeks', lessons: '16 lessons',
    skills: ['Prompt Engineering', 'AI Workflows', 'Automation', 'GPT APIs'],
  },
]

const DEFAULT_IMPACT = [
  { id: 1, value: '500+', label: 'Students Trained',     icon: '🎓' },
  { id: 2, value: '50+',  label: 'Businesses Supported', icon: '🏢' },
  { id: 3, value: '10+',  label: 'Courses Available',    icon: '📚' },
  { id: 4, value: '5',    label: 'Countries Reached',    icon: '🌍' },
]

const DEFAULT_TEAM = [
  {
    id: 1, name: 'Rotech Leadership',
    role: 'Founder & CEO',
    bio: 'Data scientist and educator with 10+ years experience in analytics, training, and business intelligence across Africa.',
    initials: 'RL', avatar_color: '#6C3FD4',
  },
  {
    id: 2, name: 'Academic Director',
    role: 'Head of Curriculum',
    bio: 'Specialist in data analytics education with experience designing practical, industry-aligned learning programmes.',
    initials: 'AD', avatar_color: '#0EA5E9',
  },
  {
    id: 3, name: 'Lead Instructor',
    role: 'Senior Data Analyst',
    bio: 'Industry practitioner with hands-on experience in fintech, e-commerce, and supply chain analytics.',
    initials: 'LI', avatar_color: '#10B981',
  },
  {
    id: 4, name: 'Business Solutions',
    role: 'Head of Business Intelligence',
    bio: 'Helps SMEs and enterprises leverage data tools to drive operational efficiency and growth.',
    initials: 'BS', avatar_color: '#F59E0B',
  },
]

const DOMAIN_TRACKS = [
  { title: 'Fintech Analytics',         icon: '💳', desc: 'Fraud detection, credit risk, and financial dashboards.' },
  { title: 'Healthcare Analytics',       icon: '🏥', desc: 'Patient data, disease surveillance, and public health.' },
  { title: 'E-commerce Analytics',       icon: '🛒', desc: 'Sales funnels, customer behaviour, and marketing attribution.' },
  { title: 'Supply Chain Analytics',     icon: '🚚', desc: 'Inventory, demand forecasting, and logistics optimisation.' },
  { title: 'Climate & Energy Analytics', icon: '🌍', desc: 'Carbon emissions, renewables, and climate data for Africa.' },
]

const LEVEL_STYLES = {
  Beginner:     { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' },
  Intermediate: { bg: '#FEF9C3', color: '#A16207', border: '#FDE68A' },
  Advanced:     { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
}

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

// ── Section: Hero ──────────────────────────────────────────────────────────────

function Hero({ data }) {
  const headline    = data?.headline    || 'Monitor. Analyse. Thrive.'
  const subheadline = data?.subheadline || 'Empowering individuals, teams, and businesses with the skills, tools, and insights to compete in a data-driven economy — built for Africa.'
  const badge       = data?.badge_text  || "Africa's Data Analytics Academy"

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: T.dark, minHeight: '88vh', display: 'flex', alignItems: 'center' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,116,139,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />
      {/* Purple glow — right */}
      <div className="absolute pointer-events-none" style={{ width: '700px', height: '700px', right: '-160px', top: '-160px', background: 'radial-gradient(circle, rgba(108,63,212,0.16) 0%, transparent 65%)', borderRadius: '50%' }} />
      {/* Teal glow — left */}
      <div className="absolute pointer-events-none" style={{ width: '400px', height: '400px', left: '-100px', bottom: '-100px', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — text */}
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border"
              style={{ color: T.textSoft, borderColor: 'rgba(139,92,246,0.4)', backgroundColor: 'rgba(108,63,212,0.12)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: T.purpleLight }} />
              {badge}
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {headline.includes('Analyse') ? (
                <>
                  Monitor.{' '}
                  <span style={{ background: `linear-gradient(135deg, ${T.purpleLight}, ${T.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Analyse.
                  </span>
                  {' '}Thrive.
                </>
              ) : headline}
            </h1>

            <p className="text-lg leading-relaxed max-w-lg" style={{ color: T.textSoft }}>
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={data?.cta_primary_href || '/auth/register'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-105 shadow-lg"
                style={{ backgroundColor: T.purple }}
              >
                {data?.cta_primary_label || 'Start Learning Free'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <a
                href={data?.cta_secondary_href || '#business'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border transition-colors hover:text-white"
                style={{ color: T.textSoft, borderColor: 'rgba(139,92,246,0.3)' }}
              >
                {data?.cta_secondary_label || 'Business Solutions →'}
              </a>
            </div>

            {/* Mini social proof */}
            <div className="flex items-center gap-8 pt-2">
              {DEFAULT_IMPACT.slice(0, 3).map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Mockup */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border p-5 space-y-4 shadow-2xl" style={{ backgroundColor: T.darkMid, borderColor: T.darkBorder }}>
              {/* Window chrome */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: T.darkBorder }}>
                <span className="text-xs font-semibold text-white">Rotech Analytics Dashboard</span>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#F87171' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FBBF24' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#34D399' }} />
                </div>
              </div>
              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Revenue', value: '₦2.4M', change: '+12%', color: T.green },
                  { label: 'Students', value: '127', change: '+8', color: T.teal },
                  { label: 'Score', value: '94%', change: '↑3%', color: T.purpleLight },
                ].map(({ label, value, change, color }) => (
                  <div key={label} className="rounded-lg p-3 border" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
                    <p className="text-xs" style={{ color: T.textMuted }}>{label}</p>
                    <p className="text-base font-extrabold text-white mt-0.5">{value}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color }}>{change}</p>
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
                <p className="text-xs font-semibold text-white mb-3">Monthly Sales (₦)</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[38, 55, 42, 70, 50, 82, 65, 78, 58, 90, 72, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 11 ? T.purple : `rgba(139,92,246,${0.18 + i * 0.04})` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map(m => (
                    <span key={m} className="text-xs" style={{ color: T.textMuted }}>{m}</span>
                  ))}
                </div>
              </div>
              {/* AI insight */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(108,63,212,0.1)', borderColor: 'rgba(139,92,246,0.22)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: T.purpleLight }}>AI Insight</p>
                <p className="text-xs leading-relaxed" style={{ color: T.textSoft }}>
                  Revenue peaked in Q4 — reallocate 20% of Q1 marketing budget to replicate the trend.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ── Section: Trust Bar ─────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    '🎓 500+ Students Trained',
    '🏢 50+ Businesses Supported',
    '🌍 5 Countries Reached',
    '📊 98% Practical Skills Focus',
    '🤖 AI-Powered Learning',
    '🏆 Industry-Certified Curriculum',
  ]
  return (
    <div
      className="border-y py-4 px-6 overflow-hidden"
      style={{ backgroundColor: T.darkMid, borderColor: T.darkBorder }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="text-xs font-semibold whitespace-nowrap"
              style={{ color: i % 2 === 0 ? T.textSoft : T.purpleLight }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section: Choose Your Path ──────────────────────────────────────────────────

function ChooseYourPath() {
  const paths = [
    {
      emoji: '🎓', iconBg: '#EDE9FE', iconColor: T.purple,
      title: 'I want to Learn Data Skills',
      desc: 'Structured courses from beginner to advanced. Excel, SQL, Power BI, Python, and AI tools — built for African learners.',
      tags: ['Excel', 'SQL', 'Power BI', 'Python'],
      cta: 'Start Learning →', href: '#courses', accentColor: T.purple,
    },
    {
      emoji: '📊', iconBg: '#DBEAFE', iconColor: '#1D4ED8',
      title: 'I want Data Tools for My Business',
      desc: 'Operational dashboards, structured data entry, AI analysis, and business intelligence solutions for growing businesses.',
      tags: ['Dashboards', 'Data Entry', 'AI Analysis', 'Insights'],
      cta: 'Explore Business Tools →', href: '#business', accentColor: T.teal,
    },
    {
      emoji: '🏢', iconBg: '#DCFCE7', iconColor: '#15803D',
      title: 'I want to Learn About Rotech',
      desc: "Our mission, vision, team, and the story behind Africa's growing data analytics and business intelligence platform.",
      tags: ['Our Mission', 'Our Vision', 'Our Team', 'Impact'],
      cta: 'Meet Us →', href: '#team', accentColor: T.green,
    },
  ]

  return (
    <section id="path" className="py-24 px-6" style={{ backgroundColor: T.light }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purple }}>Choose Your Path</p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: T.textDark }}>What brings you here today?</h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: T.textMuted }}>
              Whether you&apos;re a student, a business owner, or simply curious — we have the right path for you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 120}>
              <a
                href={p.href}
                className="group rounded-2xl p-8 border bg-white flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl h-full"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: p.iconBg }}>{p.emoji}</div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold leading-snug" style={{ color: T.textDark }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{p.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: p.iconBg, color: p.iconColor }}>{tag}</span>
                  ))}
                </div>
                <span className="text-sm font-bold" style={{ color: p.accentColor }}>{p.cta}</span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Impact Stats ──────────────────────────────────────────────────────

function ImpactSection({ stats }) {
  const items = stats?.length ? stats : DEFAULT_IMPACT

  return (
    <section className="py-20 px-6" style={{ backgroundColor: T.darkMid }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purpleLight }}>Our Impact</p>
            <h2 className="text-3xl font-extrabold text-white">Growing Across Africa</h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: T.textMuted }}>
              Real results from real learners and businesses we have worked with.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((stat, i) => (
            <ScrollReveal key={stat.id ?? stat.label ?? i} delay={i * 100}>
              <div className="rounded-2xl p-6 text-center border" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
                <p className="text-3xl mb-3">{stat.icon}</p>
                <p className="text-4xl font-extrabold text-white">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-2 text-sm font-medium" style={{ color: T.textSoft }}>{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-center mt-10 text-sm italic" style={{ color: T.textMuted }}>
          &ldquo;Monitor, Analyse, and Thrive.&rdquo;{' '}
          <span style={{ color: T.purpleLight, fontStyle: 'normal', fontWeight: 600 }}>— Rotech Data Consult</span>
        </p>
      </div>
    </section>
  )
}

// ── Section: Learning Programs ─────────────────────────────────────────────────

function CoursesSection({ programs }) {
  const items = programs?.length ? programs : DEFAULT_PROGRAMS

  return (
    <section id="courses" className="py-24 px-6" style={{ backgroundColor: T.white }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purple }}>Learning Programs</p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: T.textDark }}>Build Job-Ready Data Skills</h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: T.textMuted }}>
              Structured programs from beginner to advanced — everything the modern data professional needs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((course, i) => {
            const lv = LEVEL_STYLES[course.level] || LEVEL_STYLES.Beginner
            const skills = Array.isArray(course.skills)
              ? course.skills
              : (typeof course.skills === 'string' ? course.skills.split(',').map(s => s.trim()) : [])
            return (
              <ScrollReveal key={course.id ?? course.title} delay={(i % 3) * 100}>
                <div className="rounded-2xl border bg-white flex flex-col transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl h-full" style={{ borderColor: '#E2E8F0' }}>
                  <div className="p-6 border-b" style={{ borderColor: '#F1F5F9' }}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: course.icon_bg || '#F1F5F9' }}>
                        {course.icon}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border shrink-0" style={{ backgroundColor: lv.bg, color: lv.color, borderColor: lv.border }}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-1.5" style={{ color: T.textDark }}>{course.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{course.description}</p>
                  </div>
                  <div className="px-6 py-4 flex-1 space-y-4">
                    <div className="flex items-center gap-5 text-xs" style={{ color: T.textMuted }}>
                      <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        {course.lessons}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map(skill => (
                        <span key={skill} className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: T.light, color: T.textMid }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      href={course.cta_href || '/auth/register'}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 hover:shadow-md"
                      style={{ backgroundColor: T.purple }}
                    >
                      Enroll Free
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}

          {/* View all card */}
          <ScrollReveal delay={300}>
            <Link
              href="/courses"
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 text-center group transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 hover:-translate-y-1"
              style={{ borderColor: '#CBD5E1', minHeight: '280px' }}
            >
              <div className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110" style={{ backgroundColor: T.light }}>✨</div>
              <div>
                <p className="font-bold text-base" style={{ color: T.textDark }}>More Courses</p>
                <p className="text-sm mt-1" style={{ color: T.textMuted }}>10 courses available</p>
              </div>
              <span className="text-sm font-bold" style={{ color: T.purple }}>View All Courses →</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ── Section: AI Analyst ────────────────────────────────────────────────────────

function AISection() {
  return (
    <section id="analyst" className="py-24 px-6" style={{ backgroundColor: T.light }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left — copy */}
              <div className="p-10 space-y-6 flex flex-col justify-center" style={{ backgroundColor: T.dark }}>
                <div className="inline-flex self-start items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ color: T.textSoft, borderColor: 'rgba(139,92,246,0.35)', backgroundColor: 'rgba(108,63,212,0.12)' }}>
                  🤖 AI-Powered Tool
                </div>
                <h2 className="text-3xl font-extrabold text-white leading-snug">
                  Instant Data Analysis.{' '}
                  <span style={{ background: `linear-gradient(135deg, ${T.purpleLight}, ${T.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>No Code Required.</span>
                </h2>
                <p className="text-base leading-relaxed" style={{ color: T.textSoft }}>
                  Upload any CSV or Excel file and receive an instant full analysis — data quality report, descriptive statistics, interactive charts, and AI-generated business insights.
                </p>
                <ul className="space-y-3">
                  {['Automatic data cleaning & quality score', 'Descriptive statistics & outlier detection', '6 interactive charts auto-generated', 'AI insights tailored to your industry'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: T.textSoft }}>
                      <span className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: 'rgba(108,63,212,0.2)', color: T.purpleLight }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-105" style={{ backgroundColor: T.purple }}>
                  Try AI Analyst Free
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
              {/* Right — mock UI */}
              <div className="p-8 flex flex-col gap-4" style={{ backgroundColor: T.darkMid }}>
                <div className="rounded-xl border-2 border-dashed px-6 py-8 text-center" style={{ borderColor: T.darkBorder }}>
                  <p className="text-2xl mb-2">📂</p>
                  <p className="text-sm font-semibold text-white">sales_data_q1.csv</p>
                  <p className="text-xs mt-1" style={{ color: T.textMuted }}>CSV · 2.4 MB · Finance domain</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'Quality Score', value: '87%', color: T.green }, { label: 'Rows Cleaned', value: '1,204', color: T.teal }, { label: 'Charts Made', value: '6', color: T.purpleLight }, { label: 'AI Insights', value: '5', color: T.amber }].map(({ label, value, color }) => (
                    <div key={label} className="rounded-lg px-4 py-3 border" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
                      <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: T.textSoft }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg px-4 py-4 border text-sm leading-relaxed" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
                  <p className="font-bold text-white mb-1 flex items-center gap-1.5"><span style={{ color: T.purpleLight }}>📌</span> Key Insight</p>
                  <p style={{ color: T.textSoft }}>Revenue peaks in Q1 correlate strongly with marketing spend. Consider reallocating Q3 budget to sustain momentum.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── Section: Business Solutions ────────────────────────────────────────────────

function BusinessSection() {
  const features = [
    { icon: '📊', title: 'Operational Dashboards', desc: 'Real-time KPI tracking, revenue monitoring, and performance metrics in one place.' },
    { icon: '📝', title: 'Structured Data Entry', desc: 'Record daily sales, expenses, and inventory directly in the platform — no Excel needed.' },
    { icon: '🤖', title: 'AI Business Insights', desc: 'Upload your business data and receive instant AI-generated recommendations and strategic insights.' },
    { icon: '📈', title: 'Performance Monitoring', desc: 'Track trends over time. Spot problems early. Make decisions before they become emergencies.' },
    { icon: '🎓', title: 'Corporate Training', desc: 'Upskill your team with structured data analytics courses. Customised programs for businesses.' },
    { icon: '💼', title: 'Data Consulting', desc: 'Our team helps you design data systems, dashboards, and reporting processes from scratch.' },
  ]

  return (
    <section id="business" className="py-24 px-6" style={{ backgroundColor: T.blueBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">
          <ScrollReveal>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.teal }}>For Businesses</p>
                <h2 className="text-4xl font-extrabold leading-tight" style={{ color: T.textDark }}>Data Intelligence for Your Business</h2>
              </div>
              <p className="text-base leading-relaxed" style={{ color: T.textMuted }}>
                From paper records to boardroom dashboards — we give businesses the tools and expertise to understand their numbers, spot opportunities, and make data-driven decisions with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90" style={{ backgroundColor: T.teal }}>Get Started →</Link>
                <a href="#dataentry" className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm border transition-colors hover:bg-white" style={{ color: T.textMid, borderColor: '#CBD5E1' }}>See Data Entry Tool</a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {[{ value: '50+', label: 'Businesses Supported', color: T.teal }, { value: '3×', label: 'Avg. Decision Speed Increase', color: T.purple }, { value: '98%', label: 'Client Satisfaction', color: T.green }, { value: '5', label: 'Countries Served', color: T.amber }].map(({ value, label, color }) => (
                <div key={label} className="rounded-2xl p-6 bg-white border text-center shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                  <p className="text-3xl font-extrabold" style={{ color }}>{value}</p>
                  <p className="text-xs font-medium mt-1.5" style={{ color: T.textMuted }}>{label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={(i % 3) * 80}>
              <div className="rounded-2xl p-6 bg-white border flex gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 h-full" style={{ borderColor: '#E2E8F0' }}>
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: T.textDark }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Data Entry ────────────────────────────────────────────────────────

function DataEntrySection() {
  return (
    <section id="dataentry" className="py-24 px-6" style={{ backgroundColor: T.white }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#E2E8F0' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Mock UI */}
              <div className="p-8 flex flex-col gap-4" style={{ backgroundColor: T.dark }}>
                <div className="rounded-xl border p-5 space-y-3" style={{ backgroundColor: T.darkMid, borderColor: T.darkBorder }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T.textMuted }}>Record a Sale</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Product', 'Indomie (carton)'], ['Quantity', '10'], ['Price (₦)', '3,200'], ['Payment', 'Cash']].map(([l, v]) => (
                      <div key={l}>
                        <p className="text-xs mb-0.5" style={{ color: T.textMuted }}>{l}</p>
                        <p className="text-sm font-semibold text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-px" style={{ backgroundColor: T.darkBorder }} />
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: T.textSoft }}>Total</span>
                    <span className="font-bold text-white">₦32,000</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[['💰', 'Sales', true], ['📋', 'Expenses', false], ['📦', 'Inventory', false]].map(([icon, label, active]) => (
                    <div key={label} className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold border" style={{ backgroundColor: active ? T.purple : T.darkMid, borderColor: active ? T.purple : T.darkBorder, color: active ? 'white' : T.textMuted }}>
                      {icon} {label}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg px-4 py-3 border text-xs" style={{ backgroundColor: T.darkMid, borderColor: T.darkBorder, color: T.textSoft }}>
                  📤 <strong className="text-white">Export CSV</strong> → Upload to AI Analyst for instant insights
                </div>
              </div>
              {/* Copy */}
              <div className="p-10 space-y-6 flex flex-col justify-center" style={{ backgroundColor: T.white }}>
                <div className="inline-flex self-start items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ color: T.teal, borderColor: 'rgba(14,165,233,0.3)', backgroundColor: 'rgba(14,165,233,0.08)' }}>
                  📝 For Paper-Based Businesses
                </div>
                <h2 className="text-3xl font-extrabold leading-tight" style={{ color: T.textDark }}>
                  Still Keeping Records on Paper?{' '}<span style={{ color: T.teal }}>We Got You.</span>
                </h2>
                <p className="text-base leading-relaxed" style={{ color: T.textMuted }}>
                  Enter your daily sales, expenses, and inventory directly on the platform. No Excel needed. Export as CSV and run it through our AI Analyst to uncover patterns and make smarter decisions.
                </p>
                <ul className="space-y-3">
                  {['Record daily sales with product, quantity & payment method', 'Track expenses by category — rent, supplies, salaries', 'Monitor inventory with automatic low-stock alerts', 'Export as CSV and analyse with AI in one click'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: T.textMid }}>
                      <span className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: T.teal }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90" style={{ backgroundColor: T.teal }}>
                  Start Recording Free
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── Section: Domain Tracks ─────────────────────────────────────────────────────

function TracksSection() {
  return (
    <section id="tracks" className="py-24 px-6" style={{ backgroundColor: T.light }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purple }}>Domain Specialisations</p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: T.textDark }}>Go Deep in Your Industry</h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: T.textMuted }}>
              After mastering the foundations, specialise in a domain that matches your career goals.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAIN_TRACKS.map((track, i) => (
            <ScrollReveal key={track.title} delay={(i % 3) * 80}>
              <div className="rounded-2xl p-6 bg-white border flex items-start gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 h-full" style={{ borderColor: '#E2E8F0' }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: T.light }}>{track.icon}</div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: T.textDark }}>{track.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{track.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Team ──────────────────────────────────────────────────────────────

function TeamSection({ team }) {
  const members = team?.length ? team : DEFAULT_TEAM

  return (
    <section id="team" className="py-24 px-6" style={{ backgroundColor: T.white }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purple }}>Our Team</p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: T.textDark }}>The People Behind Rotech</h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: T.textMuted }}>
              Experienced educators, data professionals, and builders dedicated to Africa&apos;s data future.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <ScrollReveal key={member.id ?? member.name} delay={i * 100}>
              <div className="rounded-2xl p-6 border bg-white text-center flex flex-col gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 h-full" style={{ borderColor: '#E2E8F0' }}>
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo_url} alt={member.name} className="h-20 w-20 rounded-full object-cover mx-auto ring-4 ring-offset-2" style={{ '--tw-ring-color': (member.avatar_color || T.purple) + '40' }} />
                ) : (
                  <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white mx-auto ring-4 ring-offset-2" style={{ backgroundColor: member.avatar_color || T.purple, ringColor: (member.avatar_color || T.purple) + '30' }}>
                    {member.initials || member.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-base" style={{ color: T.textDark }}>{member.name}</h3>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: T.purple }}>{member.role}</p>
                  <p className="text-xs leading-relaxed mt-2" style={{ color: T.textMuted }}>{member.bio}</p>
                </div>
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold transition-colors hover:underline" style={{ color: T.teal }}>
                    LinkedIn →
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Mission & Vision ──────────────────────────────────────────────────

function MissionVision() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: T.darkMid }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(108,63,212,0.12), transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purpleLight }}>Who We Are</p>
            <h2 className="text-4xl font-extrabold text-white">Built on Purpose</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ScrollReveal delay={0}>
            <div className="rounded-2xl p-8 border h-full" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5" style={{ backgroundColor: T.purpleSoft }}>🎯</div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.purpleLight }}>Our Mission</p>
              <p className="text-base leading-relaxed" style={{ color: T.textSoft }}>
                To identify and strengthen the competencies of individuals and teams while fostering a collaborative learning ecosystem that simplifies and makes knowledge access inclusive.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="rounded-2xl p-8 border h-full" style={{ backgroundColor: T.dark, borderColor: T.darkBorder }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5" style={{ backgroundColor: 'rgba(14,165,233,0.1)' }}>🔭</div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.teal }}>Our Vision</p>
              <p className="text-base leading-relaxed" style={{ color: T.textSoft }}>
                To empower families, institutions, and businesses with the skills, tools, and ethical frameworks required to operate transparently, responsibly, and competitively within a data-driven economy.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              &ldquo;Monitor.{' '}
              <span style={{ background: `linear-gradient(135deg, ${T.purpleLight}, ${T.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analyse.</span>
              {' '}Thrive.&rdquo;
            </p>
            <p className="mt-3 text-sm font-medium" style={{ color: T.textMuted }}>— The Rotech Data Consult Motto</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── Section: Final CTA ─────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: T.dark }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(108,63,212,0.18), transparent 70%)' }} />
      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <ScrollReveal>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: T.purpleLight }}>Get Started Today</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mt-3">
            Ready to Start Your{' '}
            <span style={{ background: `linear-gradient(135deg, ${T.purpleLight}, ${T.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Data Journey?</span>
          </h2>
          <p className="text-base mt-4" style={{ color: T.textSoft }}>
            Join Rotech Data Consult. Build skills employers demand, analyse your business data with AI, and start making confident decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link href="/auth/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:scale-105 hover:shadow-lg shadow-md" style={{ backgroundColor: T.purple }}>
              Create Free Account →
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border transition-colors hover:text-white" style={{ color: T.textSoft, borderColor: T.darkBorder }}>
              Already a member? Login
            </Link>
          </div>
          <div className="mt-8">
            <QuoteRotator />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── Section: Footer ────────────────────────────────────────────────────────────

function Footer() {
  const links = {
    Learn:    [['Courses', '/courses'], ['Pricing', '/pricing'], ['Resources', '/resources']],
    Platform: [['AI Analyst', '/analyst'], ['Data Entry', '/data-entry'], ['Dashboard', '/dashboard']],
    Company:  [['About Us', '/team'], ['Privacy Policy', '/privacy'], ['Login', '/auth/login'], ['Register', '/auth/register']],
  }
  return (
    <footer className="border-t px-6 py-14" style={{ backgroundColor: '#020817', borderColor: T.darkBorder }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <p className="font-extrabold text-lg text-white">Rotech <span style={{ color: T.purpleLight }}>Data Consult</span></p>
            <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>Monitor, Analyse, and Thrive. Africa&apos;s data analytics academy and business intelligence platform.</p>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: T.textMuted }}>{section}</p>
              <ul className="space-y-2.5 text-sm" style={{ color: '#94A3B8' }}>
                {items.map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: T.darkBorder }}>
          <p className="text-xs" style={{ color: T.textMuted }}>© {new Date().getFullYear()} Rotech Data Consult. All rights reserved.</p>
          <p className="text-xs font-medium" style={{ color: T.textMuted }}>Built for Africa. Powered by Data.</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const cms = await fetchCMS()

  const impactStats  = cms?.impact?.length      ? cms.impact      : null
  const programs     = cms?.programs?.length     ? cms.programs    : null
  const testimonials = cms?.testimonials?.length ? cms.testimonials : null
  const team         = cms?.team?.length         ? cms.team        : null

  return (
    <div style={{ backgroundColor: T.dark }}>
      <LandingNavbar />
      <Hero data={cms?.hero} />
      <TrustBar />
      <ChooseYourPath />
      <ImpactSection stats={impactStats} />
      <CoursesSection programs={programs} />
      <AISection />
      <BusinessSection />
      <DataEntrySection />
      <TestimonialsSection testimonials={testimonials} />
      <TracksSection />
      <TeamSection team={team} />
      <MissionVision />
      <CTA />
      <Footer />
    </div>
  )
}
