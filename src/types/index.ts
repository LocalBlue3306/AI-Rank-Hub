export type Dimension = 'D' | 'C' | 'B'

export type DimensionScore = 1 | 2 | 3 | 4 | 5

export type DisplayLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type CoreTier = 1 | 2 | 3 | 4 | 5

export interface Option {
  label: string
  text: string
  level?: DimensionScore
}

export interface Question {
  id: string
  dimension: Dimension
  scenario: string
  options: Option[]
}

export interface Answer {
  questionId: string
  selectedOption: string
}

export interface QuizState {
  currentIndex: number
  answers: Answer[]
}

export interface ScoreResult {
  D: DimensionScore
  C: DimensionScore
  B: DimensionScore
  total: number
}

export interface LevelResult {
  coreTier: CoreTier
  displayLevel: DisplayLevel | null
  name: string
  description: string
  pendingTrophy?: boolean
}

export interface ProfileResult {
  type: string
  description: string
  suggestions: string[]
}

export type PageState = 'landing' | 'quiz' | 'trophy' | 'result'
