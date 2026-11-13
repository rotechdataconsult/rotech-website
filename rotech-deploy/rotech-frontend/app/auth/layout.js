// Auth pages are client components, so their metadata lives here.
export const metadata = {
  title: 'Account',
  description: 'Log in or create your free Rotech Data Consult account to start learning and analysing your data.',
  robots: { index: false, follow: true },
}

export default function AuthLayout({ children }) {
  return children
}
