import Link from 'next/link'

const DEEP   = '#5a1f9a'
const PURPLE = '#7B2FBE'
const LIGHT  = '#9B4FDE'
const SILVER = '#C8D4E8'
const SOFT   = '#E8E0F0'

const LAST_UPDATED = '11 March 2026'

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: SOFT }}>
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
          <span style={{ color: LIGHT }} className="mt-0.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: DEEP }}>

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: `${LIGHT}25` }}>
        <Link href="/" className="text-lg font-bold text-white">
          Rotech <span style={{ color: SILVER }}>Data Consult</span>
        </Link>
        <Link href="/auth/register" className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: LIGHT }}>
          Get Started
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-14 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border"
            style={{ color: SILVER, borderColor: `${LIGHT}40`, backgroundColor: `${PURPLE}50` }}>
            🔒 Data Protection Policy
          </div>
          <h1 className="text-3xl font-extrabold text-white">Privacy & Data Protection Policy</h1>
          <p className="text-sm" style={{ color: SILVER }}>Last updated: {LAST_UPDATED}</p>
          <p className="text-sm leading-relaxed" style={{ color: SOFT }}>
            This policy explains how Rotech Data Consult collects, uses, stores, and protects
            your personal and business data. It is compliant with the{' '}
            <strong className="text-white">Nigeria Data Protection Regulation (NDPR) 2019</strong>{' '}
            and the Nigeria Data Protection Act (NDPA) 2023.
          </p>
        </div>

        <div className="h-px" style={{ backgroundColor: `${LIGHT}20` }} />

        {/* 1 */}
        <Section title="1. Who We Are">
          <p>
            Rotech Data Consult is a Nigerian data analytics education and business intelligence platform.
            We provide structured learning courses, an AI-powered data analyst tool, and business data
            entry tools to help individuals and small businesses in Nigeria make data-driven decisions.
          </p>
          <p>
            <strong className="text-white">Data Controller:</strong> Rotech Data Consult<br />
            <strong className="text-white">Contact:</strong>{' '}
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: LIGHT }}
              className="hover:underline">
              privacy@rotechdataconsult.com
            </a>
          </p>
        </Section>

        {/* 2 */}
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

        {/* 3 */}
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

        {/* 4 */}
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

        {/* 5 */}
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

        {/* 6 */}
        <Section title="6. How Long We Keep Your Data">
          <Bullet items={[
            'Account and learning data — retained for as long as your account is active.',
            'Business entry records (sales, expenses, inventory) — retained until you delete them or close your account.',
            'Uploaded analysis files — not stored. They are processed in memory and discarded immediately after analysis.',
            'If you delete your account, all your data is permanently deleted within 30 days.',
          ]} />
        </Section>

        {/* 7 */}
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
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: LIGHT }} className="hover:underline">
              privacy@rotechdataconsult.com
            </a>. We will respond within <strong className="text-white">72 hours</strong>.
          </p>
        </Section>

        {/* 8 */}
        <Section title="8. Cookies">
          <p>
            We use only essential session cookies required for authentication. We do not use
            tracking cookies, advertising cookies, or any third-party analytics cookies.
          </p>
        </Section>

        {/* 9 */}
        <Section title="9. Children's Privacy">
          <p>
            Our platform is intended for users aged <strong className="text-white">16 and above</strong>.
            We do not knowingly collect personal data from children under 16. If you believe a
            minor has registered, please contact us immediately.
          </p>
        </Section>

        {/* 10 */}
        <Section title="10. Changes to This Policy">
          <p>
            We may update this policy to reflect changes in our services or legal requirements.
            When we make significant changes, we will notify registered users by email and update
            the "Last updated" date above. Continued use of the platform after changes constitutes
            acceptance of the updated policy.
          </p>
        </Section>

        {/* 11 */}
        <Section title="11. Contact & Complaints">
          <p>
            For any privacy-related questions or concerns, contact us at:{' '}
            <a href="mailto:privacy@rotechdataconsult.com" style={{ color: LIGHT }} className="hover:underline">
              privacy@rotechdataconsult.com
            </a>
          </p>
          <p>
            If you are unsatisfied with our response, you have the right to lodge a complaint with the{' '}
            <strong className="text-white">National Information Technology Development Agency (NITDA)</strong>,
            the regulatory authority for data protection in Nigeria.
          </p>
        </Section>

        <div className="h-px" style={{ backgroundColor: `${LIGHT}20` }} />

        {/* Footer nav */}
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: SILVER }}>
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
          <Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link>
          <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
        </div>

      </main>

      <footer className="border-t px-6 py-6 text-center text-xs" style={{ borderColor: `${LIGHT}20`, color: SILVER }}>
        © {new Date().getFullYear()} Rotech Data Consult. All rights reserved.
      </footer>
    </div>
  )
}
