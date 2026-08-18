import Link from 'next/link'
import { ComingSoonBadge } from '@/components/ui/ComingSoon'

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
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>

      {/* Nav */}
      <nav className="px-6 py-4 sticky top-0 z-40"
        style={{ backgroundColor: 'rgba(15,23,42,0.97)', borderBottom: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(14px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5">
              Login
            </Link>
            <Link href="/auth/register"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#6C3FD4' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Start free. Upgrade when your business grows. No hidden fees.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ color: '#94A3B8', border: '1px solid rgba(139,92,246,0.35)', backgroundColor: 'rgba(108,63,212,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6' }} />
            Pro & Team plans launching soon — join free now to be first in line
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.name}
              className="rounded-2xl p-7 flex flex-col gap-6 relative"
              style={{
                backgroundColor: plan.highlight ? '#1E3A5F' : '#1E293B',
                border: plan.highlight
                  ? '1px solid rgba(139,92,246,0.6)'
                  : '1px solid rgba(51,65,85,0.5)',
              }}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#6C3FD4' }}>
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
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>
                <p className="text-sm mt-2 text-slate-300">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2.5} style={{ color: '#8B5CF6' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.active ? (
                <Link href={plan.href}
                  className="block w-full text-center font-semibold rounded-xl px-4 py-3 text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#6C3FD4' }}>
                  {plan.cta}
                </Link>
              ) : (
                <button disabled
                  className="w-full font-semibold rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                  style={{ border: '1px solid rgba(51,65,85,0.4)', backgroundColor: 'rgba(15,23,42,0.4)' }}>
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
            <div key={q} className="rounded-xl p-5"
              style={{ backgroundColor: '#1E293B', border: '1px solid rgba(51,65,85,0.4)' }}>
              <p className="text-sm font-semibold text-white mb-1">{q}</p>
              <p className="text-sm text-slate-300">{a}</p>
            </div>
          ))}
        </div>

      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500"
        style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
        © {new Date().getFullYear()} Rotech Data Consult.{' '}
        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
      </footer>
    </div>
  )
}
