import { useMemo } from 'react'
import type { Answer } from '../types'
import questions from '../data/questions'
import { computeScores } from '../engine/scorer'
import { resolveLevel } from '../engine/level-resolver'
import { detectProfile, generateSuggestions } from '../engine/profile'
import LevelBadge from './LevelBadge'
import RadarChart from './RadarChart'
import ProfileCard from './ProfileCard'
import SuggestionList from './SuggestionList'

interface ResultPageProps {
  answers: Answer[]
  trophyAnswer?: 'A' | 'B'
  onRestart: () => void
}

export default function ResultPage({ answers, trophyAnswer, onRestart }: ResultPageProps) {
  const { scores, level, profile, suggestions } = useMemo(() => {
    const scores = computeScores(questions, answers)
    const level = resolveLevel(scores, trophyAnswer)
    const profile = detectProfile(scores)
    const suggestions = generateSuggestions(scores)
    return { scores, level, profile, suggestions }
  }, [answers, trophyAnswer])

  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <LevelBadge result={level} />
      <RadarChart scores={scores} />
      <ProfileCard profile={profile} />
      <SuggestionList suggestions={suggestions} />

      <div className="mt-10 text-center">
        <button
          onClick={onRestart}
          className="border border-zinc-700 px-8 py-3 text-sm uppercase tracking-wider text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
        >
          重新评测
        </button>
      </div>
    </div>
  )
}
