import { useState, useCallback } from 'react'
import type { PageState, Answer } from './types'
import questions from './data/questions'
import { computeScores } from './engine/scorer'
import { resolveLevel } from './engine/level-resolver'
import LandingPage from './components/LandingPage'
import QuizPage from './components/QuizPage'
import TrophyQuestion from './components/TrophyQuestion'
import ResultPage from './components/ResultPage'

export default function App() {
  const [pageState, setPageState] = useState<PageState>('landing')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [trophyAnswer, setTrophyAnswer] = useState<'A' | 'B' | undefined>()

  const handleStart = useCallback(() => {
    // Clear stale state from previous run
    setAnswers([])
    setTrophyAnswer(undefined)
    localStorage.removeItem('quiz-state')
    setPageState('quiz')
  }, [])

  const handleQuizComplete = useCallback((answers: Answer[]) => {
    setAnswers(answers)
    localStorage.removeItem('quiz-state')

    // Check if trophy question is needed
    const scores = computeScores(questions, answers)
    const level = resolveLevel(scores)

    if (level.pendingTrophy) {
      setPageState('trophy')
    } else {
      setPageState('result')
    }
  }, [])

  const handleTrophyAnswer = useCallback((answer: 'A' | 'B') => {
    setTrophyAnswer(answer)
    setPageState('result')
  }, [])

  const handleRestart = useCallback(() => {
    setAnswers([])
    setTrophyAnswer(undefined)
    setPageState('landing')
  }, [])

  switch (pageState) {
    case 'landing':
      return <LandingPage onStart={handleStart} />
    case 'quiz':
      return <QuizPage onComplete={handleQuizComplete} />
    case 'trophy':
      return <TrophyQuestion onAnswer={handleTrophyAnswer} />
    case 'result':
      return (
        <ResultPage
          answers={answers}
          trophyAnswer={trophyAnswer}
          onRestart={handleRestart}
        />
      )
  }
}
