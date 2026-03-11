import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are Rota, a friendly data analytics assistant for Rotech Data Consult — a platform that helps African businesses and learners understand their data.

Your role:
- Answer questions about data analysis, statistics, Excel, SQL, Power BI, Python, and business intelligence
- Help Nigerian and African SME owners understand their business data (sales, expenses, inventory)
- Explain data concepts in simple, practical terms — avoid heavy jargon
- Give short, clear answers (2–4 sentences max unless a longer explanation is truly needed)
- Use real-world examples relevant to African businesses (retail shops, restaurants, pharmacies, agribusinesses)
- Be warm, encouraging, and professional

You do NOT:
- Answer questions unrelated to data, business, or analytics
- Write full code projects (you can explain short snippets)
- Give financial/legal/medical advice

If someone asks something outside your scope, politely redirect them to data-related questions.
Always end with a practical tip or next step when relevant.`

// Simple in-memory rate limiter: max 20 requests per minute per user
const rateLimitMap = new Map()
function isRateLimited(userId) {
  const now = Date.now()
  const windowMs = 60 * 1000
  const max = 20
  const timestamps = (rateLimitMap.get(userId) || []).filter(t => now - t < windowMs)
  if (timestamps.length >= max) return true
  rateLimitMap.set(userId, [...timestamps, now])
  return false
}

export async function POST(request) {
  // Verify auth
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ detail: 'Please log in to continue.' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ detail: 'Session invalid. Please log in again.' }, { status: 401 })
  }

  // Rate limit
  if (isRateLimited(user.id)) {
    return NextResponse.json(
      { detail: 'You are sending messages too fast. Please wait a moment.' },
      { status: 429 },
    )
  }

  // Parse body
  let message = ''
  try {
    const body = await request.json()
    message = (body.message || '').trim().slice(0, 1000)
  } catch {
    return NextResponse.json({ detail: 'Invalid request.' }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json({ detail: 'Message cannot be empty.' }, { status: 400 })
  }

  // Call Claude
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ detail: 'AI service not configured.' }, { status: 503 })
  }

  try {
    const anthropic = new Anthropic({ apiKey })
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })
    const answer = response.content[0].text.trim()
    return NextResponse.json({ answer })
  } catch (err) {
    console.error('Claude API error:', err)
    return NextResponse.json({ detail: 'Could not get a response. Please try again.' }, { status: 500 })
  }
}
