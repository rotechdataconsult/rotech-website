import Link from 'next/link'
import { ComingSoonBadge } from '@/components/ui/ComingSoon'

const DEEP   = '#5a1f9a'
const PURPLE = '#7B2FBE'
const LIGHT  = '#9B4FDE'
const SILVER = '#C8D4E8'
const SOFT   = '#E8E0F0'

const PLANS = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: 'Perfect for getting started and exploring the platform.',
    features: [
      'Access to all foundation courses',
      'Domain specialisation track',
      'Quizzes and final exam',
      'Certificate of completion',
      'Business data entry (sales, expenses, inventory)',
      'AI Analyst — 5 uploads per month',
      'Export data as CSV',
    ],
    cta: 'Get Started Free',
    href: '/auth/register',
    highlight: false,
    active: true,
  },
  {
    name: 'Pro',
    price: '₦5,000',
    period: 'per month',
    description: 'For serious learners and growing businesses who need more power.',
    features: [
      'Everything in Free',
      'Unlimited AI Analyst uploads',
      'Analysis history — revisit past reports',
      'Priority AI insights (more depth)',
      'Invoice & receipt generator',
      'Inventory low-stock email alerts',
      'Accountant report export (PDF)',
      'Priority support',
    ],
    cta: 'Coming Soon',
    href: null,
    highlight: true,
    active: false,
  },
  {
    name: 'Team',
    price: '₦15,000',
    period: 'per month',
    description: 'For businesses with multiple staff who all need access.',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared business data across the team',
      'Team admin dashboard',
      'Multi-currency support (₦, $, GHS, KES)',
      'WhatsApp bot for data entry',
      'Dedicated account manager',
    ],
    cta: 'Coming Soon',
    href: null,
    highlight: false,
    active: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: DEEP }}>

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: `${LIGHT}25` }}>
        <Link href="/" className="text-lg font-bold text-white">
          Rotech <span style={{ color: SILVER }}>Data Consult</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login"
            className="text-sm font-medium text-[#E8E0F0] hover:text-white transition-colors px-3 py-1.5">
            Login
          </Link>
          <Link href="/auth/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: LIGHT }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Simple, Transparent Pricing</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: SOFT }}>
            Start free. Upgrade when your business grows. No hidden fees.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{ color: SILVER, borderColor: `${LIGHT}40`, backgroundColor: `${LIGHT}15` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: LIGHT }} />
            Pro & Team plans launching soon — join free now to be first in line
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`rounded-2xl p-7 border flex flex-col gap-6 relative ${
                plan.highlight
                  ? 'border-[#9B4FDE] bg-[#7B2FBE]'
                  : 'border-[#9B4FDE]/30 bg-[#7B2FBE]/60'
              }`}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: LIGHT }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                  {!plan.active && <ComingSoonBadge />}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm" style={{ color: SILVER }}>{plan.period}</span>
                </div>
                <p className="text-sm mt-2" style={{ color: SOFT }}>{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: SOFT }}>
                    <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2.5} style={{ color: LIGHT }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.active ? (
                <Link href={plan.href}
                  className="block w-full text-center font-semibold rounded-xl px-4 py-3 text-sm text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: LIGHT }}>
                  {plan.cta}
                </Link>
              ) : (
                <button disabled
                  className="w-full font-semibold rounded-xl px-4 py-3 text-sm text-white cursor-not-allowed opacity-50 border border-[#9B4FDE]/40">
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Common Questions</h2>
          {[
            {
              q: 'Is the free plan really free forever?',
              a: 'Yes. The free plan has no time limit. You can learn, earn certificates, and record your business data at no cost.',
            },
            {
              q: 'When will Pro and Team plans launch?',
              a: 'We are actively building them. Sign up for free now — existing users will get early access and a discounted rate when they launch.',
            },
            {
              q: 'What payment methods will you accept?',
              a: 'We will accept Paystack — so bank transfer, debit card, USSD, and mobile money will all work.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. No contracts, no lock-ins. Cancel whenever you want from your account settings.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-[#9B4FDE]/20 p-5"
              style={{ backgroundColor: `${PURPLE}60` }}>
              <p className="text-sm font-semibold text-white mb-1">{q}</p>
              <p className="text-sm" style={{ color: SOFT }}>{a}</p>
            </div>
          ))}
        </div>

      </main>

      <footer className="border-t px-6 py-6 text-center text-xs" style={{ borderColor: `${LIGHT}20`, color: SILVER }}>
        © {new Date().getFullYear()} Rotech Data Consult.{' '}
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
      </footer>
    </div>
  )
}
