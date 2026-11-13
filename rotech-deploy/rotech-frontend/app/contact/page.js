import Image from 'next/image'
import PageShell from '@/components/marketing/PageShell'
import EnquiryForm from '@/components/marketing/EnquiryForm'
import { Icon } from '@/components/marketing/ui'
import { TRACKS } from '@/lib/tracks'
import { SITE } from '@/lib/site'

export const metadata = {
  title: 'Contact Us',
  description: `Contact ${SITE.name} in ${SITE.city}, ${SITE.countryName}. Ask about course fees and dates, team training or data consulting on WhatsApp ${SITE.phoneDisplay}.`,
  alternates: { canonical: '/contact' },
}

const TOPICS = [
  ...TRACKS.map((t) => t.title),
  'Training for my team',
  'Dashboards and reporting',
  'AI and workflow automation',
  'Data consulting / M&E',
  'Something else',
]

export default function ContactPage() {
  const channels = [
    { icon: 'chat',   label: 'WhatsApp',  value: SITE.phoneDisplay,    href: SITE.whatsapp,           note: 'Fastest way to reach us' },
    { icon: 'pulse',  label: 'Phone',     value: SITE.phoneDisplay,    href: `tel:${SITE.phoneE164}`, note: 'Call or text' },
    { icon: 'users',  label: 'Instagram', value: SITE.instagramHandle, href: SITE.instagram,          note: 'Class updates and student work' },
    { icon: 'search', label: 'Location',  value: `${SITE.city}, ${SITE.countryName}`, href: null,     note: 'Physical classes in Abuja, virtual classes everywhere' },
  ]
  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE.url}/contact`,
    mainEntity: { '@id': `${SITE.url}/#organization` },
  }

  return (
    <PageShell
      eyebrow="Contact"
      title="Talk to Rotech"
      intro="Ask about fees and cohort dates, get help choosing a course, or tell us what your organisation needs. A real person replies."
      crumbs={[['Contact']]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd).replace(/</g, '\\u003c') }} />
      <section className="px-5 py-16 text-ink sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Reach us directly</h2>
            <address className="mt-6 space-y-4 not-italic">
              {channels.map((c) => (
                <div key={c.label} className="flex items-start gap-4 rounded-2xl border-2 border-brand-100 bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-lg font-bold underline underline-offset-4 hover:text-brand-700">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-lg font-bold">{c.value}</p>
                    )}
                    <p className="mt-0.5 text-sm text-ink-muted">{c.note}</p>
                  </div>
                </div>
              ))}
            </address>
            <figure className="relative mt-6 aspect-[4/3] overflow-hidden rounded-3xl ring-2 ring-brand-100">
              <Image src="/media/classroom-2.jpg" alt={`Inside the Rotech training room in ${SITE.city}`} fill sizes="(min-width: 1024px) 540px, 90vw" className="object-cover" />
            </figure>
          </div>
          <div id="enquire">
            <EnquiryForm topics={TOPICS} />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
