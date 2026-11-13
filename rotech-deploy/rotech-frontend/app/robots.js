import { SITE } from '@/lib/site'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Signed-in app areas and API routes have no search value.
        disallow: ['/admin', '/api/', '/dashboard', '/analyst', '/data-entry', '/invoice', '/team', '/whatsapp', '/resources', '/auth/reset-password', '/auth/forgot-password'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
