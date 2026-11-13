import { SITE } from '@/lib/site'
import { TRACKS } from '@/lib/tracks'

export default function sitemap() {
  const now = new Date()
  const page = (path, changeFrequency, priority) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority })
  return [
    page('/', 'weekly', 1),
    page('/programs', 'weekly', 0.9),
    ...TRACKS.map((t) => page(t.href, 'monthly', 0.9)),
    page('/pricing', 'monthly', 0.7),
    page('/about', 'monthly', 0.6),
    page('/contact', 'monthly', 0.6),
    page('/terms', 'yearly', 0.2),
    page('/privacy', 'yearly', 0.2),
  ]
}
