import { describe, test, expect } from 'vitest'
import { computeScores } from '../src/engine/scorer'
import type { Question, Answer } from '../src/types'

// Helper to build minimal questions for testing
function makeQ(id: string, dim: 'D' | 'C' | 'B', levels: Record<string, number | undefined>): Question {
  return {
    id,
    dimension: dim,
    scenario: 'test scenario',
    options: Object.entries(levels).map(([label, level]) => ({ label, text: `Option ${label}`, level })),
  }
}

function a(questionId: string, selectedOption: string): Answer {
  return { questionId, selectedOption }
}

describe('computeScores', () => {
  test('empty answers returns all 1s and total 3', () => {
    const result = computeScores([], [])
    expect(result).toEqual({ D: 1, C: 1, B: 1, total: 3 })
  })

  test('single answer per dimension', () => {
    const questions = [
      makeQ('D1', 'D', { A: 3 }),
      makeQ('C1', 'C', { A: 4 }),
      makeQ('B1', 'B', { A: 2 }),
    ]
    const answers = [a('D1', 'A'), a('C1', 'A'), a('B1', 'A')]
    const result = computeScores(questions, answers)
    expect(result).toEqual({ D: 3, C: 4, B: 2, total: 9 })
  })

  test('averages multiple answers in same dimension, rounding to nearest integer', () => {
    const questions = [
      makeQ('D1', 'D', { A: 2 }),
      makeQ('D2', 'D', { A: 3 }),
      makeQ('D3', 'D', { A: 5 }),
      makeQ('C1', 'C', { A: 4 }),
      makeQ('B1', 'B', { A: 1 }),
    ]
    const answers = [a('D1', 'A'), a('D2', 'A'), a('D3', 'A'), a('C1', 'A'), a('B1', 'A')]
    // D: (2+3+5)/3 = 3.33 → 3
    const result = computeScores(questions, answers)
    expect(result.D).toBe(3)
    expect(result.C).toBe(4)
    expect(result.B).toBe(1)
    expect(result.total).toBe(8)
  })

  test('excludes F options (no level) from average', () => {
    const questions = [
      makeQ('D1', 'D', { A: 2 }),
      makeQ('D2', 'D', { A: 4, F: undefined }), // F has no level
      makeQ('C1', 'C', { A: 3 }),
      makeQ('B1', 'B', { A: 1 }),
    ]
    const answers = [a('D1', 'A'), a('D2', 'F'), a('C1', 'A'), a('B1', 'A')]
    // D: only D1 counts → 2
    const result = computeScores(questions, answers)
    expect(result.D).toBe(2)
    expect(result.total).toBe(6)
  })

  test('dimension with all F answers falls back to 1', () => {
    const questions = [
      makeQ('D1', 'D', { A: 2, F: undefined }),
      makeQ('D2', 'D', { F: undefined }),
      makeQ('C1', 'C', { A: 3 }),
      makeQ('B1', 'B', { A: 1 }),
    ]
    const answers = [a('D1', 'F'), a('D2', 'F'), a('C1', 'A'), a('B1', 'A')]
    // D has no valid answers → 1
    const result = computeScores(questions, answers)
    expect(result.D).toBe(1)
    expect(result.C).toBe(3)
    expect(result.B).toBe(1)
  })

  test('rounds .5 up', () => {
    const questions = [
      makeQ('D1', 'D', { A: 1 }),
      makeQ('D2', 'D', { A: 2 }),
      makeQ('C1', 'C', { A: 1 }),
      makeQ('B1', 'B', { A: 1 }),
    ]
    const answers = [a('D1', 'A'), a('D2', 'A'), a('C1', 'A'), a('B1', 'A')]
    // D: (1+2)/2 = 1.5 → 2
    expect(computeScores(questions, answers).D).toBe(2)
  })

  test('handles missing dimension (no questions for a dimension)', () => {
    const questions = [
      makeQ('D1', 'D', { A: 3 }),
      makeQ('C1', 'C', { A: 4 }),
    ]
    const answers = [a('D1', 'A'), a('C1', 'A')]
    const result = computeScores(questions, answers)
    expect(result.B).toBe(1)
    expect(result.total).toBe(8)
  })

  test('handles unanswered questions (question exists but not in answers)', () => {
    const questions = [
      makeQ('D1', 'D', { A: 3 }),
      makeQ('D2', 'D', { A: 3 }),
      makeQ('C1', 'C', { A: 2 }),
      makeQ('B1', 'B', { A: 2 }),
    ]
    const answers = [a('D1', 'A'), a('C1', 'A'), a('B1', 'A')]
    // D2 not answered, only D1 counts → D=3
    const result = computeScores(questions, answers)
    expect(result.D).toBe(3)
    expect(result.C).toBe(2)
    expect(result.B).toBe(2)
    expect(result.total).toBe(7)
  })
})
