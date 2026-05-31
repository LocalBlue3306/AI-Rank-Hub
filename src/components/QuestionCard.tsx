import type { Question } from '../types'

interface QuestionCardProps {
  question: Question
  selectedOption: string | null
  onSelect: (label: string) => void
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelect,
}: QuestionCardProps) {
  const dimLabel = {
    D: '使用深度',
    C: '认知层次',
    B: '应用广度',
  }[question.dimension]

  return (
    <div>
      <span className="inline-block text-xs tracking-widest uppercase text-text-dim border border-border px-2 py-0.5 mb-4">
        {dimLabel}
      </span>

      <p className="text-lg leading-relaxed text-zinc-200 mb-8">
        {question.scenario}
      </p>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.label
          return (
            <button
              key={opt.label}
              onClick={() => onSelect(opt.label)}
              className={`w-full text-left px-4 py-3 border transition text-sm leading-relaxed ${
                isSelected
                  ? 'border-white/30 bg-white/5 text-white'
                  : 'border-border hover:border-border-active text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-text-dim mr-2">{opt.label}.</span>
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
