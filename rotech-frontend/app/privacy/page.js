import Link from 'next/link'

const LAST_UPDATED = '11 March 2026'

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 text-slate-300">
        {children}
      </div>
    </section>
  )
}

function Bullet({ items }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0" style={{ color: '#8B5CF6' }}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>

      {/* Nav */}
      <nav className="px-6 py-4 sticky top-0 z-40"
        style={{ backgroundColor: 'rgba(15,23,42,0.97)', borderBottom: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(14px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
            Rotech <span style={{ color: '#8B5CF6' }}>Data Consult</span>
          </Link>
          <Link href="/auth/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#6C3FD4' }}>
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-14 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: '#94A3B8', border: '1px solid rgba(139,92,246,0.35)', backgroundColor: 'rgba(30,41,59,0.6)' }}>
            🔒 Data Protection Policy
          </div>
          <h1 className="text-3xl font-extrabold text-white">Privacy & Data Protection Policy</h1>
          <p className="text-sm text-slate-400">Last updated: {LAST_UPDATED}</p>
          <p className="text-sm leading-relaxed text-slate-300">
            This policy explains how Rotech Data Consult collects, uses, stores, and protects
            your personal and business data. It is compliant with the{' '}
            <strong className="text-white">Nigeria Data Protection Regulation (NDPR) 2019</strong>{' '}
            and the Nigeria Data Protection Act (NDPA) 2023.
          </p>
        </div>

        <div className="h-px" style={{ backgroundColor: 'rgba(51,65,85,0.5)' }} />

        <Section title="1. Who We Are">
          <p>
            Rotech Data Consult is a Nigerian data analytics education and business intelligence platform.
            We provide structured learning courses, an AI-powered data analyst tool, and business data
            entry tools to help individuals and small businesses in Nigeria make data-driven decisions.
          </p>
          <p>
            <strong className="text-white">Data Controller:</strong> Rotech Data Consult<br />
            <strong className="text-white">Contact:</strong>{' '}
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: '#8B5CF6' }}
              className="hover:underline">
              privacy@rotechdataconsult.com
            </a>
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p><strong className="text-white">Account Data:</strong></p>
          <Bullet items={[
            'Full name and email address (collected at registration)',
            'Password (stored as a secure hash — we never see your actual password)',
            'Selected domain track and learning preferences',
          ]} />

          <p><strong className="text-white">Learning Activity Data:</strong></p>
          <Bullet items={[
            'Lessons completed and quiz scores',
            'Course progress and certificate records',
            'Time spent on learning modules',
          ]} />

          <p><strong className="text-white">Business Data (Data Entry Tool):</strong></p>
          <Bullet items={[
            'Sales records — product names, quantities, prices, payment methods',
            'Expense records — categories, amounts, descriptions',
            'Inventory records — product stock levels, costs, and selling prices',
          ]} />

          <p><strong className="text-white">Uploaded Files (AI Analyst Tool):</strong></p>
          <Bullet items={[
            'CSV or Excel files you upload for analysis',
            'Files are processed in memory and are not permanently stored on our servers',
            'Analysis results are displayed to you and not retained after your session',
          ]} />
        </Section>

        <Section title="3. How We Use Your Data">
          <Bullet items={[
            'To create and manage your account',
            'To track your learning progress and issue certificates',
            'To store your business records securely so you can access them anytime',
            'To generate AI-powered insights from your uploaded datasets',
            'To improve the platform based on aggregated, anonymised usage patterns',
            'To send important service communications (e.g. password reset)',
          ]} />
          <p>
            We do <strong className="text-white">not</strong> use your data for advertising,
            profiling, or sell it to any third party. Ever.
          </p>
        </Section>

        <Section title="4. How Your Business Data Is Protected">
          <p>
            We take the protection of your business data extremely seriously. The following
            technical measures are in place:
          </p>
          <Bullet items={[
            'Row Level Security (RLS) — your records are only accessible by you. No other user, admin, or third party can read your sales, expenses, or inventory data.',
            'Data is stored in Supabase, which uses AES-256 encryption at rest and TLS 1.2+ encryption in transit.',
            'We do not expose raw business data to any AI model. Only statistical summaries are sent for AI analysis — never individual records.',
            'Access is authenticated via secure JWT tokens managed by Supabase Auth.',
          ]} />
        </Section>

        <Section title="5. Data Sharing">
          <p>We share your data <strong className="text-white">only</strong> in the following limited cases:</p>
          <Bullet items={[
            'Supabase (our database provider) — for secure storage. They process data on our behalf under a Data Processing Agreement.',
            'Anthropic (Claude AI) — only statistical summaries of your uploaded files are sent for AI analysis. Raw records and personal data are never shared.',
            'Law enforcement — only if required by Nigerian law or a valid court order.',
          ]} />
          <p>
            Your data is <strong className="text-white">never sold, rented, or shared</strong> with
            marketing companies, data brokers, or any other commercial third party.
          </p>
        </Section>

        <Section title="6. How Long We Keep Your Data">
          <Bullet items={[
            'Account and learning data — retained for as long as your account is active.',
            'Business entry records (sales, expenses, inventory) — retained until you delete them or close your account.',
            'Uploaded analysis files — not stored. They are processed in memory and discarded immediately after analysis.',
            'If you delete your account, all your data is permanently deleted within 30 days.',
          ]} />
        </Section>

        <Section title="7. Your Rights Under NDPR/NDPA">
          <p>As a data subject, you have the following rights:</p>
          <Bullet items={[
            'Right to access — request a copy of all data we hold about you.',
            'Right to rectification — correct any inaccurate personal data.',
            'Right to erasure — request deletion of your account and all associated data.',
            'Right to data portability — export your business data as CSV at any time using the Export button in the Data Entry section.',
            'Right to object — object to any processing of your data.',
            'Right to withdraw consent — you may close your account at any time.',
          ]} />
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: '#8B5CF6' }} className="hover:underline">
              privacy@rotechdataconsult.com
            </a>. We will respond within <strong className="text-white">72 hours</strong>.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use only essential session cookies required for authentication. We do not use
            tracking cookies, advertising cookies, or any third-party analytics cookies.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our platform is intended for users aged <strong className="text-white">16 and above</strong>.
            We do not knowingly collect personal data from children under 16. If you believe a
            minor has registered, please contact us immediately.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this policy to reflect changes in our services or legal requirements.
            When we make significant changes, we will notify registered users by email and update
            the "Last updated" date above. Continued use of the platform after changes constitutes
            acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact & Complaints">
          <p>
            For any privacy-related questions or concerns, contact us at:{' '}
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: '#8B5CF6' }} className="hover:underline">
              privacy@rotechdataconsult.com
            </a>
          </p>
          <p>
            If you are unsatisfied with our response, you have the right to lodge a complaint with the{' '}
            <strong className="text-white">National Information Technology Development Agency (NITDA)</strong>,
            the regulatory authority for data protection in Nigeria.
          </p>
        </Section>

        <div className="h-px" style={{ backgroundColor: 'rgba(51,65,85,0.5)' }} />

        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
          <Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link>
          <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
        </div>

      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500"
        style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
        © {new Date().getFullYear()} Rotech Data Consult. All rights reserved.
      </footer>
    </div>
  )
}
