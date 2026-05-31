import { useState, useCallback, useEffect } from 'react'
import type { Answer, Question, QuizState } from '../types'
import questions from '../data/questions'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

function loadState(): QuizState {
  try {
    const raw = localStorage.getItem('quiz-state')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed.currentIndex === 'number' && Array.isArray(parsed.answers)) {
        return parsed
      }
    }
  } catch { /* corrupted */ }
  return { currentIndex: 0, answers: [] }
}

function saveState(state: QuizState) {
  localStorage.setItem('quiz-state', JSON.stringify(state))
}

interface QuizPageProps {
  onComplete: (answers: Answer[]) => void
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [state, setState] = useState<QuizState>(loadState)
  const currentQ: Question = questions[state.currentIndex]
  const selectedAnswer = state.answers.find(
    (a) => a.questionId === currentQ.id
  )

  const handleSelect = useCallback(
    (label: string) => {
      setState((prev) => {
        const existing = prev.answers.findIndex(
          (a) => a.questionId === currentQ.id
        )
        let newAnswers: Answer[]
        if (existing >= 0) {
          newAnswers = prev.answers.map((a, i) =>
            i === existing ? { ...a, selectedOption: label } : a
          )
        } else {
          newAnswers = [
            ...prev.answers,
            { questionId: currentQ.id, selectedOption: label },
          ]
        }

        // Auto-advance after selection
        const nextIndex = prev.currentIndex + 1
        const nextState: QuizState = {
          currentIndex: nextIndex,
          answers: newAnswers,
        }
        saveState(nextState)

        if (nextIndex >= questions.length) {
          onComplete(newAnswers)
        }

        return nextState
      })
    },
    [currentQ.id, onComplete]
  )

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const labels = currentQ.options.map((o) => o.label)
      const idx = labels.indexOf(e.key.toUpperCase())
      if (idx >= 0) handleSelect(labels[idx])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentQ.options, handleSelect])

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <ProgressBar current={state.currentIndex + 1} total={questions.length} />
      <QuestionCard
        question={currentQ}
        selectedOption={selectedAnswer?.selectedOption ?? null}
        onSelect={handleSelect}
      />
    </div>
  )
}
