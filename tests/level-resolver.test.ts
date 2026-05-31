import { describe, test, expect } from 'vitest'
import { resolveLevel } from '../src/engine/level-resolver'
import type { ScoreResult } from '../src/types'

function s(D: number, C: number, B: number): ScoreResult {
  return { D, C, B, total: D + C + B } as ScoreResult
}

describe('resolveLevel', () => {
  // ============================================================
  // Core-5
  // ============================================================

  test('D=5, C=5, B=5 → Core-5, pendingTrophy (no trophy answer)', () => {
    const result = resolveLevel(s(5, 5, 5))
    expect(result.coreTier).toBe(5)
    expect(result.pendingTrophy).toBe(true)
    expect(result.displayLevel).toBeNull()
  })

  test('D=5, C=5, B=5, trophy A → Lv.9', () => {
    const result = resolveLevel(s(5, 5, 5), 'A')
    expect(result.coreTier).toBe(5)
    expect(result.displayLevel).toBe(9)
    expect(result.pendingTrophy).toBeUndefined()
  })

  test('D=5, C=5, B=5, trophy B → Lv.10', () => {
    const result = resolveLevel(s(5, 5, 5), 'B')
    expect(result.coreTier).toBe(5)
    expect(result.displayLevel).toBe(10)
    expect(result.pendingTrophy).toBeUndefined()
  })

  // ============================================================
  // Core-4
  // ============================================================

  test('D=5, C=5, B=4 (总14) → Core-4, total≥14 → Lv.8', () => {
    const result = resolveLevel(s(5, 5, 4))
    expect(result.coreTier).toBe(4)
    expect(result.displayLevel).toBe(8)
  })

  test('D=5, C=4, B=4 (总13) → Core-4, total=13 → Lv.7', () => {
    const result = resolveLevel(s(5, 4, 4))
    expect(result.coreTier).toBe(4)
    expect(result.displayLevel).toBe(7)
  })

  // ============================================================
  // Core-3
  // ============================================================

  test('D=3, C=2, B=3 (总8) → Core-3, total≤8 → Lv.4', () => {
    const result = resolveLevel(s(3, 2, 3))
    expect(result.coreTier).toBe(3)
    expect(result.displayLevel).toBe(4)
  })

  test('D=4, C=3, B=3 (总10) → Core-3, total≥9 AND D≥4 AND C≥3 → Lv.6', () => {
    const result = resolveLevel(s(4, 3, 3))
    expect(result.coreTier).toBe(3)
    expect(result.displayLevel).toBe(6)
  })

  test('D=4, C=2, B=4 (总10) → Core-3, total≥9 but C<3 → 兜底 Lv.5', () => {
    const result = resolveLevel(s(4, 2, 4))
    expect(result.coreTier).toBe(3)
    expect(result.displayLevel).toBe(5)
  })

  test('D=3, C=5, B=5 (总13) → Core-3, total≥9 but D<4 → 兜底 Lv.5', () => {
    const result = resolveLevel(s(3, 5, 5))
    expect(result.coreTier).toBe(3)
    expect(result.displayLevel).toBe(5)
  })

  // ============================================================
  // Core-2
  // ============================================================

  test('D=2, C=1, B=1 (总4) → Core-2, total≤5 → Lv.2', () => {
    const result = resolveLevel(s(2, 1, 1))
    expect(result.coreTier).toBe(2)
    expect(result.displayLevel).toBe(2)
  })

  test('D=2, C=2, B=1 (总5) → Core-2, total≤5 → Lv.2', () => {
    const result = resolveLevel(s(2, 2, 1))
    expect(result.coreTier).toBe(2)
    expect(result.displayLevel).toBe(2)
  })

  test('D=3, C=2, B=1 (总6) → Core-2, total≥6 → Lv.3', () => {
    const result = resolveLevel(s(3, 2, 1))
    expect(result.coreTier).toBe(2)
    expect(result.displayLevel).toBe(3)
  })

  test('D=5, C=4, B=2 (总11) → Core-2 (B=2 blocks Core-3), total≥6 → Lv.3', () => {
    const result = resolveLevel(s(5, 4, 2))
    expect(result.coreTier).toBe(2)
    expect(result.displayLevel).toBe(3)
  })

  // ============================================================
  // Core-1
  // ============================================================

  test('D=1, C=1, B=1 (总3) → Core-1, total≤3 → Lv.0', () => {
    const result = resolveLevel(s(1, 1, 1))
    expect(result.coreTier).toBe(1)
    expect(result.displayLevel).toBe(0)
  })

  test('D=2, C=1, B=1 (总4) goes Core-2 not Core-1', () => {
    const result = resolveLevel(s(2, 1, 1))
    expect(result.coreTier).toBe(2) // D≥2 triggers Core-2 first
  })

  test('D=1, C=2, B=1 (总4) → Core-1, total≥4 → Lv.1', () => {
    const result = resolveLevel(s(1, 2, 1))
    expect(result.coreTier).toBe(1)
    expect(result.displayLevel).toBe(1)
  })

  // ============================================================
  // Edge: impossible combo per spec (D=5, C=1, B=5)
  // ============================================================

  test('D=5, C=1, B=5 (总11) → Core-3 (B≥3, D≥3), total≥9 but C<3 → 兜底 Lv.5', () => {
    const result = resolveLevel(s(5, 1, 5))
    expect(result.coreTier).toBe(3)
    expect(result.displayLevel).toBe(5)
  })
})
