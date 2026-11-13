// Single source of truth for public site facts used by metadata, structured
// data, the sitemap and the marketing pages.

export const SITE = {
  name: 'Rotech Data Consult',
  shortName: 'Rotech',
  // Set NEXT_PUBLIC_SITE_URL in the hosting environment to the live domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://rotechdataconsult.com').replace(/\/$/, ''),
  motto: 'Monitor. Analyse. Thrive.',
  tagline: 'Data that works as hard as you do.',
  description:
    'Rotech Data Consult is a data, AI and tech academy in Abuja, Nigeria. Learn data analysis, Python, AI automation, UI/UX and cyber security in class or online, and get analytics, dashboards and training for your business.',
  city: 'Abuja',
  country: 'NG',
  countryName: 'Nigeria',
  phoneDisplay: '0902 761 5382',
  phoneE164: '+2349027615382',
  whatsapp: 'https://wa.me/2349027615382',
  instagram: 'https://www.instagram.com/rotech_data',
  instagramHandle: '@rotech_data',
  email: 'privacy@rotechdataconsult.com',
  founder: {
    name: 'Abiola Lawal',
    role: 'Founder',
    linkedin: 'https://www.linkedin.com/in/abiola-lawal-abdulrafiu/',
    // Written from the founder's CV; employers are deliberately not named.
    bio: [
      'Abiola Lawal is a data and AI practitioner based in Abuja, with a career that spans public health monitoring and evaluation and microfinance banking.',
      'That work includes health-worker training data with national and state primary health care agencies, and a Gates Foundation-funded routine immunisation programme that reached more than 50,000 children.',
      'Abiola holds an MSc in Information Technology (Artificial Intelligence), built ABIYAMO, a health chatbot presented at the AI in Health Summit in Abuja, and hosts data analysis webinars as a JMP Student Advocate.',
      'Rotech brings that field experience into the classroom: every course is built around real Nigerian data and the problems people actually face at work.',
    ],
  },
}

export const whatsappLink = (text) =>
  text ? `${SITE.whatsapp}?text=${encodeURIComponent(text)}` : SITE.whatsapp
