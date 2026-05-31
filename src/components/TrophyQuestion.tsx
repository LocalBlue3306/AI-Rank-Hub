import { useState } from 'react'
import questions from '../data/questions'

interface TrophyQuestionProps {
  onAnswer: (answer: 'A' | 'B') => void
}

export default function TrophyQuestion({ onAnswer }: TrophyQuestionProps) {
  const tq = questions.find((q) => q.id === 'T1')
  const [selected, setSelected] = useState<string | null>(null)

  if (!tq) return null

  const handleConfirm = () => {
    if (selected) onAnswer(selected as 'A' | 'B')
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-20">
      <p className="text-xs tracking-widest uppercase text-text-dim border border-border inline-block px-2 py-0.5 mb-6">
        终极确认
      </p>

      <p className="text-lg leading-relaxed text-zinc-200 mb-8">
        {tq.scenario}
      </p>

      <div className="space-y-3 mb-8">
        {tq.options.map((opt) => {
          const isSelected = selected === opt.label
          return (
            <button
              key={opt.label}
              onClick={() => setSelected(opt.label)}
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

      <button
        onClick={handleConfirm}
        disabled={!selected}
        className={`px-8 py-3 text-sm uppercase tracking-wider border transition ${
          selected
            ? 'border-white/30 text-white hover:bg-white/5'
            : 'border-border text-text-dim cursor-not-allowed'
        }`}
      >
        确认 →
      </button>
    </div>
  )
}
