'use client'

import { ComingSoonPage } from '@/components/ui/ComingSoon'

export default function TeamPage() {
  return (
    <ComingSoonPage
      icon="👥"
      title="Team Accounts"
      description="Add your staff and colleagues to your Rotech account. Everyone on the team can enter sales data, view inventory, and access reports — all under one business account. Coming as part of the Team plan."
      backHref="/dashboard"
      backLabel="← Back to Dashboard"
    />
  )
}
