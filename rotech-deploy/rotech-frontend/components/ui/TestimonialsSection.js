'use client'

import { useState, useEffect, useCallback } from 'react'
import ScrollReveal from './ScrollReveal'

const STARS = [1, 2, 3, 4, 5]

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: 'Before Rotech, I could barely read an Excel file. Now I build dashboards for my entire department every week. This platform completely changed my career trajectory.',
    author_name: 'Amara Okonkwo',
    author_role: 'Admin Officer → Data Analyst',
    author_location: 'Lagos, Nigeria',
    author_initials: 'AO',
    avatar_color: '#6C3FD4',
    rating: 5,
  },
  {
    id: 2,
    quote: 'We used to make business decisions based on gut feeling. After joining Rotech, we built a proper sales dashboard and discovered we were losing ₦200k monthly on slow-moving stock.',
    author_name: 'Emeka Nwachukwu',
    author_role: 'Shop Owner',
    author_location: 'Onitsha, Anambra',
    author_initials: 'EN',
    avatar_color: '#0EA5E9',
    rating: 5,
  },
  {
    id: 3,
    quote: 'The SQL and Python courses are incredibly practical. I landed my first data analyst job three months after completing the program. The AI tools module was the real game-changer.',
    author_name: 'Fatima Al-Hassan',
    author_role: 'Graduate → Junior Data Analyst',
    author_location: 'Abuja, Nigeria',
    author_initials: 'FA',
    avatar_color: '#10B981',
    rating: 5,
  },
  {
    id: 4,
    quote: 'The Power BI course alone paid for itself. I presented a dashboard to my manager and got promoted within two months. I wish I had found Rotech earlier in my career.',
    author_name: 'Chukwuemeka Eze',
    author_role: 'Finance Officer',
    author_location: 'Port Harcourt, Nigeria',
    author_initials: 'CE',
    avatar_color: '#F59E0B',
    rating: 5,
  },
  {
    id: 5,
    quote: 'As a small business owner with no tech background, I was intimidated. But Rotech\'s approach is so practical — I now track all my inventory and sales data confidently every day.',
    author_name: 'Ngozi Adeyemi',
    author_role: 'SME Owner',
    author_location: 'Ibadan, Nigeria',
    author_initials: 'NA',
    avatar_color: '#BE185D',
    rating: 5,
  },
]

function TestimonialCard({ t }) {
  return (
    <div
      className="rounded-2xl p-7 flex flex-col gap-5 border bg-white h-full"
      style={{ borderColor: '#E2E8F0' }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {STARS.map(i => (
          <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill={i <= (t.rating || 5) ? '#F59E0B' : '#E5E7EB'}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: '#334155' }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {t.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.photo_url}
            alt={t.author_name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: t.avatar_color || '#6C3FD4' }}
          >
            {t.author_initials || t.author_name?.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{t.author_name}</p>
          <p className="text-xs" style={{ color: '#64748B' }}>
            {t.author_role}{t.author_location ? ` · ${t.author_location}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ testimonials }) {
  const items = (testimonials?.length ? testimonials : DEFAULT_TESTIMONIALS)
  const [active, setActive] = useState(0)
  const total  = items.length

  const next = useCallback(() => setActive(i => (i + 1) % total), [total])
  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total])

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">

        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6C3FD4' }}>
              Student Stories
            </p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: '#0F172A' }}>
              Hear From Our Students
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
              Real outcomes from real people who chose to invest in their data skills.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: 3-column grid of active, active+1, active+2 */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {[0, 1, 2].map(offset => {
            const idx = (active + offset) % total
            return (
              <ScrollReveal key={idx} delay={offset * 120}>
                <TestimonialCard t={items[idx]} />
              </ScrollReveal>
            )
          })}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <TestimonialCard t={items[active]} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="h-9 w-9 rounded-full border flex items-center justify-center transition-colors hover:bg-white"
            style={{ borderColor: '#E2E8F0', color: '#64748B' }}
            aria-label="Previous testimonial"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{
                  width:           i === active ? '20px' : '8px',
                  height:          '8px',
                  backgroundColor: i === active ? '#6C3FD4' : '#CBD5E1',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="h-9 w-9 rounded-full border flex items-center justify-center transition-colors hover:bg-white"
            style={{ borderColor: '#E2E8F0', color: '#64748B' }}
            aria-label="Next testimonial"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}
