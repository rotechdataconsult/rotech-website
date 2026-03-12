'use client'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuizQuestion({
  question,
  options,
  selected,
  onSelect,
  revealed,      // true after submission — show correct/wrong
  correctAnswer,
  explanation,
  index,
  total,
}) {
  function getStyle(option) {
    if (!revealed) {
      return selected === option
        ? 'border-[#9B4FDE] bg-[#9B4FDE]/20 text-white'
        : 'border-[#9B4FDE]/30 bg-[#6B28A8] text-[#E8E0F0] hover:border-[#9B4FDE]/60 hover:text-white'
    }
    if (option === correctAnswer)  return 'border-green-500 bg-green-500/15 text-green-300'
    if (option === selected)       return 'border-red-500 bg-red-500/15 text-red-300'
    return 'border-[#9B4FDE]/20 bg-[#6B28A8]/50 text-[#C8D4E8] opacity-60'
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <p className="text-xs text-[#C8D4E8]">Question {index + 1} of {total}</p>

      {/* Question */}
      <h3 className="text-white font-semibold text-base leading-relaxed">{question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !revealed && onSelect(option)}
            disabled={revealed}
            className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${getStyle(option)}`}
          >
            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold mt-0.5">
              {LETTERS[i]}
            </span>
            <span className="text-sm leading-relaxed">{option}</span>
          </button>
        ))}
      </div>

      {/* Explanation after reveal */}
      {revealed && explanation && (
        <div className="bg-[#6B28A8] border border-[#9B4FDE]/40 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-[#9B4FDE] mb-1">Explanation</p>
          <p className="text-sm text-[#E8E0F0] leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
