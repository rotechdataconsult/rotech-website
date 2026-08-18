'use client'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuizQuestion({
  question,
  options,
  selected,
  onSelect,
  revealed,
  correctAnswer,
  explanation,
  index,
  total,
}) {
  function getStyle(option) {
    if (!revealed) {
      return selected === option
        ? { border: '1px solid #8B5CF6', backgroundColor: 'rgba(139,92,246,0.2)', color: 'white' }
        : { border: '1px solid rgba(51,65,85,0.6)', backgroundColor: '#0F172A', color: '#CBD5E1' }
    }
    if (option === correctAnswer)  return { border: '1px solid #22c55e', backgroundColor: 'rgba(34,197,94,0.12)', color: '#86efac' }
    if (option === selected)       return { border: '1px solid #ef4444', backgroundColor: 'rgba(239,68,68,0.12)', color: '#fca5a5' }
    return { border: '1px solid rgba(51,65,85,0.3)', backgroundColor: 'rgba(15,23,42,0.5)', color: '#64748B', opacity: 0.6 }
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400">Question {index + 1} of {total}</p>
      <h3 className="text-white font-semibold text-base leading-relaxed">{question}</h3>

      <div className="space-y-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !revealed && onSelect(option)}
            disabled={revealed}
            className="w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all"
            style={getStyle(option)}
            onMouseEnter={e => { if (!revealed && selected !== option) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)' }}
            onMouseLeave={e => { if (!revealed && selected !== option) e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)' }}
          >
            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold mt-0.5">
              {LETTERS[i]}
            </span>
            <span className="text-sm leading-relaxed">{option}</span>
          </button>
        ))}
      </div>

      {revealed && explanation && (
        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: '#0F172A', border: '1px solid rgba(139,92,246,0.3)' }}>
          <p className="text-xs font-semibold text-violet-400 mb-1">Explanation</p>
          <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
