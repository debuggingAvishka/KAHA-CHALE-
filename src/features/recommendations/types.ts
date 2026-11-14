
export type Mood =
  | 'peaceful'
  | 'cozy'
  | 'adventurous'
  | 'romantic'
  | 'lively'
  | 'cultural'

export type Interest =
  | 'nature'
  | 'food'
  | 'history'
  | 'shopping'
  | 'adventure'
  | 'art'

export type Company =
  | 'solo'
  | 'friends'
  | 'partner'
  | 'family'

export type BudgetRange =
  | 'free'
  | 'under-200'
  | '200-500'
  | '500-plus'

export interface QuizAnswers {
  moods: Mood[]
  interests: Interest[]
  company: Company | null
  budget: BudgetRange | null
}
export interface QuizOption<T extends string> {
  value: T
  label: string
  description: string
  icon: string
}