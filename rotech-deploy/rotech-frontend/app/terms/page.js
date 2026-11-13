import Link from 'next/link'
import PageShell from '@/components/marketing/PageShell'
import { SITE } from '@/lib/site'

// DRAFT: written as a sensible starting point, not legal advice. Have it
// reviewed, and replace section 5 with your actual payment and refund terms.
const LAST_UPDATED = '13 November 2026'

export const metadata = {
  title: 'Terms of Use',
  description: `The terms that apply when you use the ${SITE.name} website, learning platform and courses.`,
  alternates: { canonical: '/terms' },
}

const SECTIONS = [
  {
    title: '1. Who we are',
    body: [
      `${SITE.name} ("Rotech", "we", "us") provides data, AI and technology training, consulting services and an online learning and analytics platform from ${SITE.city}, ${SITE.countryName}. These terms apply to anyone who uses this website, the platform or our courses.`,
    ],
  },
  {
    title: '2. Your account',
    body: [
      'You need an account to use the learning platform and tools. Give accurate information, keep your password private, and tell us promptly if you think someone else has used your account. You are responsible for activity on your account.',
    ],
  },
  {
    title: '3. Acceptable use',
    body: [
      'Use the website and platform lawfully and respectfully. Do not attempt to break or overload our systems, access data that is not yours, share your login with others, or upload content that is unlawful or that you have no right to share.',
    ],
  },
  {
    title: '4. Courses and certificates',
    body: [
      'Course outlines, schedules and delivery modes are published in good faith and may be adjusted to improve the course or respond to circumstances; we will tell enrolled learners about significant changes.',
      'A certificate is awarded when you complete a track and pass its final assessment. Certificates confirm completion of Rotech training; they are not a guarantee of employment.',
    ],
  },
  {
    title: '5. Fees, payment and refunds',
    body: [
      'Creating an account is free. Fees for instructor-led cohorts, paid plans and consulting work are confirmed to you in writing before you pay, together with the payment and refund terms that apply to that cohort or engagement.',
    ],
  },
  {
    title: '6. Your data and files',
    body: [
      'Files and records you upload to the platform remain yours. You give us permission to process them only to provide the service to you, for example to generate an analysis you have asked for. Do not upload personal or confidential data unless you are entitled to. How we handle personal data is explained in our Privacy Policy.',
    ],
  },
  {
    title: '7. AI-generated analysis',
    body: [
      'The AI Analyst and AI assistant produce automated output that can contain errors. Treat it as decision support, check important figures against your source data, and take professional advice before making significant financial, medical or legal decisions.',
    ],
  },
  {
    title: '8. Our content',
    body: [
      'Course materials, exercises, datasets, software and branding belong to Rotech or its licensors. They are for your personal learning; do not resell, republish or redistribute them without our written permission. Work you create yourself during a course is yours.',
    ],
  },
  {
    title: '9. Availability and liability',
    body: [
      'We work to keep the website and platform available and accurate but provide them "as is" and cannot promise they will be uninterrupted or error-free. To the extent the law allows, we are not liable for indirect or consequential loss arising from use of the website, platform or course content. Nothing in these terms limits rights you have under Nigerian consumer protection law.',
    ],
  },
  {
    title: '10. Changes and governing law',
    body: [
      'We may update these terms; the date above shows the latest version, and continued use means you accept the changes. These terms are governed by the laws of the Federal Republic of Nigeria.',
    ],
  },
]

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Use"
      intro={`Last updated ${LAST_UPDATED}. Please read these terms before using the website, platform or courses.`}
      crumbs={[['Terms of Use']]}
    >
      <article className="mx-auto max-w-3xl px-5 py-16 text-ink sm:px-6 lg:py-20">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-extrabold">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-base leading-relaxed text-ink-soft">{p}</p>
              ))}
            </section>
          ))}
          <section>
            <h2 className="font-display text-xl font-extrabold">11. Contact</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Questions about these terms? Reach us through the{' '}
              <Link href="/contact" className="font-bold text-brand-700 underline underline-offset-4">contact page</Link>
              {' '}or on WhatsApp {SITE.phoneDisplay}. See also our{' '}
              <Link href="/privacy" className="font-bold text-brand-700 underline underline-offset-4">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  )
}
