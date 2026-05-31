import type { Question, Answer, ScoreResult, Dimension, DimensionScore } from '../types'

export function computeScores(questions: Question[], answers: Answer[]): ScoreResult {
  const answerMap = new Map(answers.map(a => [a.questionId, a.selectedOption]))

  const dims: Dimension[] = ['D', 'C', 'B']
  const scores: Record<Dimension, DimensionScore> = { D: 1, C: 1, B: 1 }

  for (const dim of dims) {
    const dimQuestions = questions.filter(q => q.dimension === dim)
    const levels: number[] = []

    for (const q of dimQuestions) {
      const selected = answerMap.get(q.id)
      if (!selected) continue
      const option = q.options.find(o => o.label === selected)
      if (option?.level !== undefined) {
        levels.push(option.level)
      }
    }

    if (levels.length > 0) {
      const sum = levels.reduce((acc, v) => acc + v, 0)
      scores[dim] = Math.round(sum / levels.length) as DimensionScore
    }
  }

  return {
    D: scores.D,
    C: scores.C,
    B: scores.B,
    total: scores.D + scores.C + scores.B,
  }
}
