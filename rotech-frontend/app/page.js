import Link from 'next/link'
import QuoteRotator from '@/components/ui/QuoteRotator'

// ── Brand colors ───────────────────────────────────────────────────────────────
const PURPLE     = '#7B2FBE'
const DEEP       = '#5a1f9a'
const LIGHT      = '#9B4FDE'
const SILVER     = '#C8D4E8'
const SOFT_WHITE = '#E8E0F0'

// ── Data ───────────────────────────────────────────────────────────────────────

const FOUNDATION_COURSES = [
  {
    title: 'Excel for Data Analysis',
    desc:  'Master pivot tables, VLOOKUP, and dashboards — the foundation every analyst needs.',
    icon:  '📊',
    level: 'Beginner',
  },
  {
    title: 'SQL for Data Analysis',
    desc:  'Write queries to extract, filter, join and aggregate data from relational databases.',
    icon:  '🗄️',
    level: 'Beginner',
  },
  {
    title: 'Power BI Dashboards',
    desc:  'Build interactive dashboards. Connect to live data sources and share insights visually.',
    icon:  '📈',
    level: 'Intermediate',
  },
  {
    title: 'Python for Data Analysis',
    desc:  'Use Pandas, NumPy and Matplotlib to analyse and visualise datasets at scale.',
    icon:  '🐍',
    level: 'Intermediate',
  },
  {
    title: 'AI Tools for Data Analysts',
    desc:  'Use ChatGPT, Claude, and AI tools to accelerate your workflow. The future of data.',
    icon:  '🤖',
    level: 'Advanced',
  },
]

const DOMAIN_TRACKS = [
  { title: 'Fintech Analytics',        icon: '💳', desc: 'Fraud detection, credit risk, financial dashboards.' },
  { title: 'Healthcare Analytics',     icon: '🏥', desc: 'Patient data, disease surveillance, public health.' },
  { title: 'E-commerce Analytics',     icon: '🛒', desc: 'Sales funnels, customer behaviour, marketing attribution.' },
  { title: 'Supply Chain Analytics',   icon: '🚚', desc: 'Inventory, demand forecasting, logistics optimisation.' },
  { title: 'Climate & Energy Analytics', icon: '🌍', desc: 'Carbon emissions, renewables, climate data for Africa.' },
]

const STATS = [
  { value: '10+', label: 'Courses' },
  { value: '5',   label: 'Domain Tracks' },
  { value: 'AI',  label: 'Powered Analyst' },
  { value: '100%', label: 'Practical Skills' },
]

const LEVEL_COLOR = {
  Beginner:     `bg-green-500/20 text-green-300 border border-green-500/30`,
  Intermediate: `bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`,
  Advanced:     `bg-red-500/20 text-red-300 border border-red-500/30`,
}

// ── Components ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: DEEP, borderColor: `${LIGHT}30` }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-extrabold tracking-tight text-white">
          Rotech <span style={{ color: SILVER }}>Data Consult</span>
        </span>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <a href="#courses"    style={{ color: SOFT_WHITE }} className="hover:text-white transition-colors">Courses</a>
          <a href="#analyst"   style={{ color: SOFT_WHITE }} className="hover:text-white transition-colors">AI Analyst</a>
          <a href="#dataentry" style={{ color: SOFT_WHITE }} className="hover:text-white transition-colors">Data Entry</a>
          <a href="#tracks"    style={{ color: SOFT_WHITE }} className="hover:text-white transition-colors">Tracks</a>
          <Link href="/pricing" style={{ color: SOFT_WHITE }} className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-semibold px-4 py-1.5 rounded-lg border transition-colors hover:text-white"
            style={{ color: SOFT_WHITE, borderColor: `${LIGHT}50` }}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: LIGHT }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 px-6" style={{ backgroundColor: DEEP }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${LIGHT}25, transparent 70%)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border"
          style={{ color: SILVER, borderColor: `${LIGHT}50`, backgroundColor: `${PURPLE}50` }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: SILVER }} />
          Africa&apos;s Data Analytics Academy
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Turn Data Into{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${SILVER}, ${LIGHT})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Career Success
          </span>
        </h1>

        <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: SOFT_WHITE }}>
          Learn industry-ready data analytics skills with structured courses, domain specialisations,
          and an AI-powered analyst tool — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-85 shadow-lg"
            style={{ backgroundColor: LIGHT }}
          >
            Start Learning Free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#analyst"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border transition-colors hover:text-white"
            style={{ color: SOFT_WHITE, borderColor: `${LIGHT}50` }}
          >
            Try AI Analyst
          </a>
        </div>

        {/* Quote */}
        <QuoteRotator />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-4 border text-center"
              style={{ backgroundColor: `${PURPLE}60`, borderColor: `${LIGHT}30` }}
            >
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-xs mt-1" style={{ color: SILVER }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoursesSection() {
  return (
    <section id="courses" className="py-20 px-6" style={{ backgroundColor: PURPLE }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Foundation Skills</h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: SOFT_WHITE }}>
            Start with the tools every data professional uses daily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FOUNDATION_COURSES.map((course) => (
            <div
              key={course.title}
              className="rounded-xl p-6 border flex flex-col gap-4 hover:border-opacity-60 transition-colors"
              style={{ backgroundColor: `${DEEP}80`, borderColor: `${LIGHT}30` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{course.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${LEVEL_COLOR[course.level]}`}>
                  {course.level}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">{course.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: SOFT_WHITE }}>{course.desc}</p>
              </div>
            </div>
          ))}

          {/* View all card */}
          <Link
            href="/auth/register"
            className="rounded-xl p-6 border flex flex-col items-center justify-center gap-3 text-center group transition-all hover:border-opacity-80"
            style={{ borderColor: `${LIGHT}50`, borderStyle: 'dashed' }}
          >
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${LIGHT}25` }}
            >
              →
            </div>
            <p className="font-semibold text-sm text-white">View All Courses</p>
            <p className="text-xs" style={{ color: SILVER }}>10 courses available</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

function AISection() {
  return (
    <section id="analyst" className="py-20 px-6" style={{ backgroundColor: DEEP }}>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${LIGHT}30` }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left — copy */}
            <div className="p-10 space-y-6 flex flex-col justify-center" style={{ backgroundColor: `${PURPLE}70` }}>
              <div
                className="inline-flex self-start items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: SILVER, borderColor: `${LIGHT}40`, backgroundColor: `${LIGHT}20` }}
              >
                🤖 AI-Powered
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Instant Data Analysis — No Code Required
              </h2>
              <p className="text-base leading-relaxed" style={{ color: SOFT_WHITE }}>
                Upload any CSV or Excel file and get an instant full analysis: data cleaning report,
                statistics, interactive charts, and AI-generated business insights — in seconds.
              </p>

              <ul className="space-y-3">
                {[
                  'Automatic data cleaning & quality score',
                  'Descriptive statistics & outlier detection',
                  '6 interactive charts auto-generated',
                  'AI insights tailored to your industry domain',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: SOFT_WHITE }}>
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      strokeWidth={2.5} style={{ color: SILVER }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-85"
                style={{ backgroundColor: LIGHT }}
              >
                Try AI Analyst Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Right — mock UI */}
            <div
              className="p-8 flex flex-col gap-4"
              style={{ backgroundColor: `${DEEP}90` }}
            >
              {/* Mock upload card */}
              <div
                className="rounded-xl border-2 border-dashed px-6 py-8 text-center"
                style={{ borderColor: `${LIGHT}40` }}
              >
                <p className="text-2xl mb-2">📂</p>
                <p className="text-sm font-medium text-white">sales_data_q1.csv</p>
                <p className="text-xs mt-1" style={{ color: SILVER }}>CSV · 2.4 MB · Finance domain</p>
              </div>

              {/* Mock result cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Quality Score', value: '87', color: LIGHT },
                  { label: 'Rows Cleaned', value: '1,204', color: SILVER },
                  { label: 'Charts Made', value: '6', color: LIGHT },
                  { label: 'AI Insights', value: '5', color: SILVER },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-lg px-4 py-3 border"
                    style={{ backgroundColor: `${PURPLE}60`, borderColor: `${LIGHT}25` }}
                  >
                    <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
                    <p className="text-xs mt-0.5" style={{ color: SOFT_WHITE }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Mock insight */}
              <div
                className="rounded-lg px-4 py-4 border text-sm leading-relaxed"
                style={{ backgroundColor: `${PURPLE}60`, borderColor: `${LIGHT}25`, color: SOFT_WHITE }}
              >
                <p className="font-semibold text-white mb-1">📌 Key Insight</p>
                Revenue peaks in Q1 correlate strongly with marketing spend.
                Consider reallocating Q3 budget to sustain momentum.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TracksSection() {
  return (
    <section id="tracks" className="py-20 px-6" style={{ backgroundColor: PURPLE }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Domain Specialisations</h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: SOFT_WHITE }}>
            After mastering the foundations, go deep in your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAIN_TRACKS.map((track) => (
            <div
              key={track.title}
              className="rounded-xl p-6 border flex items-start gap-4 transition-colors"
              style={{ backgroundColor: `${DEEP}80`, borderColor: `${LIGHT}30` }}
            >
              <span className="text-2xl shrink-0">{track.icon}</span>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">{track.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: SOFT_WHITE }}>{track.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DataEntrySection() {
  return (
    <section id="dataentry" className="py-20 px-6" style={{ backgroundColor: DEEP }}>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${LIGHT}30` }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Right — mock UI */}
            <div className="p-8 flex flex-col gap-4 order-last lg:order-first" style={{ backgroundColor: `${DEEP}90` }}>
              {/* Mock form */}
              <div className="rounded-xl border p-5 space-y-3" style={{ backgroundColor: `${PURPLE}60`, borderColor: `${LIGHT}25` }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: SILVER }}>Record a Sale</p>
                <div className="grid grid-cols-2 gap-2">
                  {[['Product', 'Indomie (carton)'], ['Quantity', '10'], ['Price (₦)', '3,200'], ['Payment', 'Cash']].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs" style={{ color: SILVER }}>{label}</p>
                      <p className="text-sm font-medium text-white">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px" style={{ backgroundColor: `${LIGHT}20` }} />
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: SOFT_WHITE }}>Total</span>
                  <span className="font-bold text-white">₦32,000</span>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-2">
                {[['💰', 'Sales'], ['📋', 'Expenses'], ['📦', 'Inventory']].map(([icon, label]) => (
                  <div key={label} className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium border"
                    style={{ backgroundColor: label === 'Sales' ? `${LIGHT}30` : `${PURPLE}40`, borderColor: `${LIGHT}25`, color: label === 'Sales' ? 'white' : SILVER }}>
                    {icon} {label}
                  </div>
                ))}
              </div>
              {/* Export hint */}
              <div className="rounded-lg px-4 py-3 border text-xs" style={{ backgroundColor: `${PURPLE}40`, borderColor: `${LIGHT}20`, color: SOFT_WHITE }}>
                📤 <strong className="text-white">Export CSV</strong> → Upload to AI Analyst for instant insights
              </div>
            </div>

            {/* Left — copy */}
            <div className="p-10 space-y-6 flex flex-col justify-center" style={{ backgroundColor: `${PURPLE}70` }}>
              <div
                className="inline-flex self-start items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: SILVER, borderColor: `${LIGHT}40`, backgroundColor: `${LIGHT}20` }}
              >
                📝 For Paper-Based Businesses
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Still Keeping Records on Paper?{' '}
                <span style={{ background: `linear-gradient(135deg, ${SILVER}, ${LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  We Got You.
                </span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: SOFT_WHITE }}>
                Enter your daily sales, expenses, and inventory directly on the platform.
                No Excel needed. When you are ready, export the data and run it through our AI Analyst
                to uncover patterns, spot problems, and make smarter decisions.
              </p>
              <ul className="space-y-3">
                {[
                  'Record daily sales with product, quantity & payment method',
                  'Track expenses by category — rent, supplies, salaries, utilities',
                  'Monitor inventory levels with automatic low-stock alerts',
                  'Export as CSV and analyse with AI in one click',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: SOFT_WHITE }}>
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      strokeWidth={2.5} style={{ color: SILVER }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register"
                className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-85"
                style={{ backgroundColor: LIGHT }}>
                Start Recording Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: DEEP }}>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Ready to Start Your{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${SILVER}, ${LIGHT})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Data Career?
          </span>
        </h2>
        <p className="text-base" style={{ color: SOFT_WHITE }}>
          Join Rotech Data Consult and build skills that employers demand.
          Start with free courses and upgrade anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-85 shadow-lg"
            style={{ backgroundColor: LIGHT }}
          >
            Create Free Account
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base border transition-colors hover:text-white"
            style={{ color: SOFT_WHITE, borderColor: `${LIGHT}50` }}
          >
            Already a member? Login
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t px-6 py-8" style={{ backgroundColor: DEEP, borderColor: `${LIGHT}25` }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-white">
          Rotech <span style={{ color: SILVER }}>Data Consult</span>
        </span>
        <p className="text-xs" style={{ color: SILVER }}>
          © {new Date().getFullYear()} Rotech Data Consult. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-xs" style={{ color: SILVER }}>
          <Link href="/auth/register" className="hover:text-white transition-colors">Get Started</Link>
          <Link href="/auth/login"    className="hover:text-white transition-colors">Login</Link>
          <Link href="/pricing"       className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/courses"       className="hover:text-white transition-colors">Courses</Link>
          <Link href="/privacy"       className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ backgroundColor: DEEP }}>
      <Navbar />
      <Hero />
      <CoursesSection />
      <AISection />
      <DataEntrySection />
      <TracksSection />
      <CTA />
      <Footer />
    </div>
  )
}
