import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * POST /api/revalidate
 * Called by admin CMS pages after saving content.
 * Triggers an immediate ISR revalidation of the landing page.
 *
 * No auth needed — revalidation only refreshes the cache, exposes nothing.
 */
export async function POST() {
  revalidatePath('/')
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}
