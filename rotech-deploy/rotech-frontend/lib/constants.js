// ─── Brand ───────────────────────────────────────────────────────────────────
export const COLORS = {
  bg:       '#5a1f9a',
  card:     '#7B2FBE',
  input:    '#6B28A8',
  primary:  '#9B4FDE',
  silver:   '#C8D4E8',
  soft:     '#E8E0F0',
}

// ─── Tools ───────────────────────────────────────────────────────────────────
export const TOOLS = ['Excel', 'SQL', 'Power BI', 'Python', 'Capstone']

export const TOOL_STYLES = {
  Excel:      { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30'  },
  SQL:        { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30'   },
  'Power BI': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Python:     { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  Capstone:   { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/30'   },
}

export const TOOL_CLASS = (tool) => {
  const s = TOOL_STYLES[tool]
  return s ? `${s.bg} ${s.text} border ${s.border}` : 'bg-[#9B4FDE]/20 text-[#E8E0F0]'
}

// ─── Lesson types ─────────────────────────────────────────────────────────────
export const LESSON_TYPE_LABELS = {
  reading:  { label: 'Reading',  icon: '📖' },
  exercise: { label: 'Exercise', icon: '✏️'  },
  project:  { label: 'Project',  icon: '🛠️' },
}

// ─── Quiz / Exam ──────────────────────────────────────────────────────────────
export const PASS_MARK = 70   // percent
