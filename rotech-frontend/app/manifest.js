import { SITE } from '@/lib/site'

export default function manifest() {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#683AA6',
    icons: [
      { src: '/brand/rotech-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/rotech-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
