import { describe, test, expect } from 'vitest'
import { detectProfile, generateSuggestions } from '../src/engine/profile'
import type { ScoreResult } from '../src/types'

function s(D: number, C: number, B: number): ScoreResult {
  return { D, C, B, total: D + C + B } as ScoreResult
}

describe('detectProfile', () => {
  test('D high, C low → 机械执行者', () => {
    // D=5, C=1, B=3: D avg(1,3)=3 → diff 2 ✓, C avg(5,3)=4 → diff 3 ✓
    const result = detectProfile(s(5, 1, 3))
    expect(result.type).toBe('机械执行者')
  })

  test('C high, D low → 理论派', () => {
    // C=5, D=1, B=3: C avg(1,3)=3 → diff 2 ✓, D avg(5,3)=4 → diff 3 ✓
    const result = detectProfile(s(1, 5, 3))
    expect(result.type).toBe('理论派')
  })

  test('B high, D low → 浅尝辄止者', () => {
    // B=5, D=1, C=3: B avg(1,3)=3 → diff 2 ✓, D avg(5,3)=4 → diff 3 ✓
    const result = detectProfile(s(1, 3, 5))
    expect(result.type).toBe('浅尝辄止者')
  })

  test('D high, B low → 深度专家', () => {
    // D=5, B=1, C=3: D avg(1,3)=3 → diff 2 ✓, B avg(5,3)=4 → diff 3 ✓
    const result = detectProfile(s(5, 3, 1))
    expect(result.type).toBe('深度专家')
  })

  test('C high, B low → 纸上谈兵', () => {
    // C=5, B=1, D=3: C avg(1,3)=3 → diff 2 ✓, B avg(5,3)=4 → diff 3 ✓
    const result = detectProfile(s(3, 5, 1))
    expect(result.type).toBe('纸上谈兵')
  })

  test('balanced high (diff≤1, avg≥4) → 全能型', () => {
    const result = detectProfile(s(5, 5, 4))
    expect(result.type).toBe('全能型')
  })

  test('balanced low (diff≤1, avg≤3) → 入门型', () => {
    const result = detectProfile(s(1, 2, 2))
    expect(result.type).toBe('入门型')
  })

  test('no clear bias, not balanced → 发展中', () => {
    // D=4, C=2, B=3: D-(2+3)/2=1.5 <2, no clear bias. diff>1 so not balanced.
    const result = detectProfile(s(4, 2, 3))
    expect(result.type).toBe('发展中')
  })

  test('D=5, C=5, B=5 → 全能型', () => {
    const result = detectProfile(s(5, 5, 5))
    expect(result.type).toBe('全能型')
  })
})

describe('generateSuggestions', () => {
  test('D lowest → returns D suggestions', () => {
    const result = generateSuggestions(s(2, 4, 4))
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toContain('追问')
  })

  test('C lowest → returns C suggestions', () => {
    const result = generateSuggestions(s(4, 2, 4))
    expect(result[0]).toContain('验证')
  })

  test('B lowest → returns B suggestions', () => {
    const result = generateSuggestions(s(4, 4, 2))
    expect(result[0]).toContain('场景')
  })

  test('multiple dimensions tied for lowest → merges one suggestion from each', () => {
    const result = generateSuggestions(s(2, 2, 5))
    // D and C tied at 2
    expect(result.length).toBeGreaterThanOrEqual(2)
  })

  test('all dimensions high → returns allHigh suggestions', () => {
    const result = generateSuggestions(s(5, 5, 5))
    expect(result.some(s => s.includes('复用'))).toBe(true)
  })
})
