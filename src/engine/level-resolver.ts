import type { ScoreResult, LevelResult } from '../types'
import { getLevelInfo } from '../data/level-mapping'

export function resolveLevel(scores: ScoreResult, trophyAnswer?: string): LevelResult {
  const { D, C, B, total } = scores

  // Core-5: all dimensions maxed
  if (D === 5 && C === 5 && B === 5) {
    if (trophyAnswer === 'A') {
      const info = getLevelInfo(9)
      return { coreTier: 5, displayLevel: 9, name: info.name, description: info.description }
    }
    if (trophyAnswer === 'B') {
      const info = getLevelInfo(10)
      return { coreTier: 5, displayLevel: 10, name: info.name, description: info.description }
    }
    return { coreTier: 5, displayLevel: null, name: '', description: '', pendingTrophy: true }
  }

  // Core-4: D≥5, C≥4, B≥4
  if (D >= 5 && C >= 4 && B >= 4) {
    if (total >= 14) {
      const info = getLevelInfo(8)
      return { coreTier: 4, displayLevel: 8, name: info.name, description: info.description }
    }
    const info = getLevelInfo(7)
    return { coreTier: 4, displayLevel: 7, name: info.name, description: info.description }
  }

  // Core-3: B≥3, D≥3
  if (B >= 3 && D >= 3) {
    if (total <= 8) {
      const info = getLevelInfo(4)
      return { coreTier: 3, displayLevel: 4, name: info.name, description: info.description }
    }
    if (total >= 9 && D >= 4 && C >= 3) {
      const info = getLevelInfo(6)
      return { coreTier: 3, displayLevel: 6, name: info.name, description: info.description }
    }
    const info = getLevelInfo(5)
    return { coreTier: 3, displayLevel: 5, name: info.name, description: info.description }
  }

  // Core-2: D≥2
  if (D >= 2) {
    if (total <= 5) {
      const info = getLevelInfo(2)
      return { coreTier: 2, displayLevel: 2, name: info.name, description: info.description }
    }
    const info = getLevelInfo(3)
    return { coreTier: 2, displayLevel: 3, name: info.name, description: info.description }
  }

  // Core-1: default
  if (total <= 3) {
    const info = getLevelInfo(0)
    return { coreTier: 1, displayLevel: 0, name: info.name, description: info.description }
  }
  const info = getLevelInfo(1)
  return { coreTier: 1, displayLevel: 1, name: info.name, description: info.description }
}
