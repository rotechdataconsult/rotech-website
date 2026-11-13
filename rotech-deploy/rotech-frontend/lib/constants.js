// ─── Brand ───────────────────────────────────────────────────────────────────
export const COLORS = {
  bg:       '#0F172A',
  card:     '#1E293B',
  input:    '#0F172A',
  primary:  '#683AA6',
  silver:   '#94A3B8',
  soft:     '#CBD5E1',
}

// ─── Tools ───────────────────────────────────────────────────────────────────
export const TOOLS = [
  'Excel', 'Power Query', 'SQL', 'Power BI', 'Python', 'JMP',
  'AI', 'n8n', 'APIs',
  'UX Research', 'Figma', 'Portfolio',
  'Health Data', 'DHIS2',
  'Security', 'Networking', 'Linux', 'SIEM', 'Cloud', 'GRC',
  'Capstone',
]

export const TOOL_STYLES = {
  Excel:         { bg: 'bg-green-500/15',   text: 'text-green-400',   border: 'border-green-500/30'   },
  'Power Query': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  SQL:           { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/30'    },
  'Power BI':    { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'border-yellow-500/30'  },
  Python:        { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/30'  },
  JMP:           { bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30'     },
  AI:            { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  n8n:           { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/30'    },
  APIs:          { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/30'  },
  'UX Research': { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30'   },
  Figma:         { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30'  },
  Portfolio:     { bg: 'bg-slate-500/15',   text: 'text-slate-300',   border: 'border-slate-500/30'   },
  'Health Data': { bg: 'bg-teal-500/15',    text: 'text-teal-400',    border: 'border-teal-500/30'    },
  DHIS2:         { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/30'    },
  Security:      { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30'     },
  Networking:    { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/30'    },
  Linux:         { bg: 'bg-lime-500/15',    text: 'text-lime-400',    border: 'border-lime-500/30'    },
  SIEM:          { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30'  },
  Cloud:         { bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30'     },
  GRC:           { bg: 'bg-slate-500/15',   text: 'text-slate-300',   border: 'border-slate-500/30'   },
  Capstone:      { bg: 'bg-pink-500/15',    text: 'text-pink-400',    border: 'border-pink-500/30'    },
}

export const TOOL_CLASS = (tool) => {
  const s = TOOL_STYLES[tool]
  return s ? `${s.bg} ${s.text} border ${s.border}` : 'bg-violet-500/20 text-slate-300'
}

// ─── Lesson types ─────────────────────────────────────────────────────────────
export const LESSON_TYPE_LABELS = {
  reading:  { label: 'Reading',  icon: '📖' },
  exercise: { label: 'Exercise', icon: '✏️'  },
  project:  { label: 'Project',  icon: '🛠️' },
}

// ─── Quiz / Exam ──────────────────────────────────────────────────────────────
export const PASS_MARK = 70   // percent
