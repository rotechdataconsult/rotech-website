'use client'

import { ComingSoonPage } from '@/components/ui/ComingSoon'

export default function AnalysisHistoryPage() {
  return (
    <ComingSoonPage
      icon="📂"
      title="Analysis History"
      description="Soon you will be able to revisit every dataset you have uploaded — view past cleaning reports, charts, and AI insights without re-uploading. Your analysis library, always available."
      backHref="/analyst"
      backLabel="← Back to Analyst Tool"
    />
  )
}
