import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const PROMPTS = {
  hero: `You are a conversion copywriter for Rotech Data Consult — an African EdTech and business intelligence platform.
Motto: "Monitor, Analyse, and Thrive."
Mission: empower individuals, teams, and businesses with data skills.
Generate 5 short, punchy hero headline options. Each must be under 10 words.
Numbered list only. No explanations.`,

  course: `You write short, benefit-focused course descriptions for Rotech Data Consult.
Each description must be 1–2 sentences max. Lead with a career benefit, not a feature list.
Make it practical and relevant to African professionals.`,

  testimonial: `You write realistic student testimonials for Rotech Data Consult — an African data analytics platform.
Write a single testimonial in first person. 40–60 words. Specific, emotional, credible.
Reference a real outcome: job change, business improvement, salary increase, or promoted.`,

  cta: `You write call-to-action button text for Rotech Data Consult — an African EdTech platform.
Generate 5 short CTA variants (2–5 words each). Numbered list only.
Make them action-oriented and benefit-focused.`,

  general: `You are a content strategist for Rotech Data Consult — Africa's data analytics academy.
Help the admin write landing page content. Be concise, professional, and relevant to African learners and businesses.
Keep responses under 100 words.`,
}

export async function POST(request) {
  // Verify auth
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
  const { data: { user }, error } = await sb.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const context = body.context || 'general'
  const prompt  = (body.prompt || '').trim().slice(0, 500)
  const system  = PROMPTS[context] || PROMPTS.general

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 503 })

  try {
    const anthropic = new Anthropic({ apiKey })
    const response  = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system,
      messages:   [{ role: 'user', content: prompt || 'Generate content for this section.' }],
    })
    return NextResponse.json({ result: response.content[0].text.trim() })
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err).slice(0, 200) }, { status: 500 })
  }
}
