// Public course catalogue. Curriculum content comes from lib/tracks.json, which
// is a copy of ../curriculum/tracks.json (re-copy it when the curriculum
// changes). Presentation and commercial details live in META below.

import raw from './tracks.json'

const SESSIONS_PER_WEEK = 3 // live sessions each week
const LESSONS_PER_WEEK = 4  // 3 sessions + 1 weekly project/review on the platform

// fee and nextCohort are shown on the course page when filled in, e.g.
//   fee: '₦120,000', nextCohort: '2027-01-18'
// Leave them null to show "ask us for the current fee and date" instead.
const META = {
  'ai-automation': { slug: 'ai-automation',                icon: '🤖', level: 'Beginner',     skills: ['n8n', 'Prompting', 'APIs & Webhooks', 'AI Agents'],            fee: null, nextCohort: null },
  python:          { slug: 'python-programming',           icon: '🐍', level: 'Beginner',     skills: ['Python', 'Git & GitHub', 'pytest', 'FastAPI'],                  fee: null, nextCohort: null },
  'ui-ux':         { slug: 'ui-ux-design',                 icon: '🎨', level: 'Beginner',     skills: ['User Research', 'Figma', 'Prototyping', 'Usability Testing'],  fee: null, nextCohort: null },
  health:          { slug: 'public-health-data-analytics', icon: '🏥', level: 'Intermediate', skills: ['DHIS2', 'Data Quality', 'Power BI', 'Epidemiology'],            fee: null, nextCohort: null },
  accountants:     { slug: 'data-analysis-for-accountants', icon: '📒', level: 'Intermediate', skills: ['Power Query', 'Reconciliations', 'Power BI', 'Audit Analytics'], fee: null, nextCohort: null },
  engineers:       { slug: 'data-analysis-for-engineers',  icon: '⚙️', level: 'Intermediate', skills: ['Python', 'SPC', 'Design of Experiments', 'Reliability'],        fee: null, nextCohort: null },
  cyber:           { slug: 'cyber-security',               icon: '🛡️', level: 'Beginner',     skills: ['Linux', 'Networking', 'SIEM', 'Incident Response'],             fee: null, nextCohort: null },
}

export const TRACKS = raw.map((t) => {
  const meta = META[t.id] || { slug: t.id, icon: '📘', level: 'Beginner', skills: t.tools.slice(0, 4), fee: null, nextCohort: null }
  let weekNo = 0
  const phases = t.phases.map(([name, weeks]) => ({
    name,
    weeks: weeks.map(([title, topics, deliverable]) => ({ number: ++weekNo, title, topics, deliverable })),
  }))
  return {
    id: t.id,
    code: t.code,
    slug: meta.slug,
    title: t.name,
    description: t.pitch,
    who: t.who,
    tools: t.tools,
    certificates: t.certs.split(';').map((c) => c.trim()).filter(Boolean),
    roles: t.roles,
    capstone: t.capstone,
    // "problem → how the course answers it"
    answers: t.answers.map((a) => {
      const [problem, answer] = a.split('→').map((x) => x.trim())
      return { problem, answer: answer || '' }
    }),
    phases,
    weeks: t.weeks,
    sessionsPerWeek: SESSIONS_PER_WEEK,
    duration: `${t.weeks} weeks`,
    lessons: `${t.weeks * LESSONS_PER_WEEK} lessons`,
    icon: meta.icon,
    level: meta.level,
    skills: meta.skills,
    fee: meta.fee,
    nextCohort: meta.nextCohort,
    href: `/programs/${meta.slug}`,
  }
})

export const getTrack = (slug) => TRACKS.find((t) => t.slug === slug)

// CMS programs only carry a title, so match on it to find the public page.
export const trackHrefForTitle = (title) =>
  TRACKS.find((t) => t.title.toLowerCase() === String(title || '').toLowerCase())?.href || null

export function formatCohortDate(iso) {
  if (!iso) return null
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}
