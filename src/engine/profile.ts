import type { ScoreResult, ProfileResult } from '../types'
import { PROFILE_DEFS, pickSuggestions, SUGGESTIONS_BY_DIMENSION } from '../data/level-mapping'

function mean(a: number, b: number): number {
  return (a + b) / 2
}

function isHigh(val: number, other1: number, other2: number): boolean {
  return val - mean(other1, other2) >= 2
}

function isLow(val: number, other1: number, other2: number): boolean {
  return mean(other1, other2) - val >= 2
}

export function detectProfile(scores: ScoreResult): ProfileResult {
  const { D, C, B } = scores
  const avg = (D + C + B) / 3
  const range = Math.max(D, C, B) - Math.min(D, C, B)

  // Check bias first
  const dHigh = isHigh(D, C, B)
  const dLow = isLow(D, C, B)
  const cHigh = isHigh(C, D, B)
  const cLow = isLow(C, D, B)
  const bHigh = isHigh(B, D, C)
  const bLow = isLow(B, D, C)

  const toResult = (def: { type: string; description: string }): ProfileResult => ({
    ...def,
    suggestions: [],
  })

  if (dHigh && cLow) return toResult(PROFILE_DEFS['机械执行者'])
  if (cHigh && dLow) return toResult(PROFILE_DEFS['理论派'])
  if (bHigh && dLow) return toResult(PROFILE_DEFS['浅尝辄止者'])
  if (dHigh && bLow) return toResult(PROFILE_DEFS['深度专家'])
  if (cHigh && bLow) return toResult(PROFILE_DEFS['纸上谈兵'])

  // Balanced
  if (range <= 1) {
    if (avg >= 4) return toResult(PROFILE_DEFS['全能型'])
    if (avg <= 3) return toResult(PROFILE_DEFS['入门型'])
  }

  return toResult(PROFILE_DEFS['发展中'])
}

export function generateSuggestions(scores: ScoreResult): string[] {
  const { D, C, B } = scores

  // All dimensions high → allHigh suggestions
  if (D >= 4 && C >= 4 && B >= 4) {
    return SUGGESTIONS_BY_DIMENSION.allHigh
  }

  return pickSuggestions({ D, C, B })
}
