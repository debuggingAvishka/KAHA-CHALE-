import type { Mood, Interest, Company } from '../recommendations/types'

export interface Place {
  id: string
  name: string
  category: string
  description: string
  area: string
  region: 'Jabalpur' | 'Nearby' | 'Extended trip' | 'To be verified'
  imageUrl: string
  latitude: number | null
  longitude: number | null
  sourceUrl?: string
  verificationStatus: 'unverified' | 'partially_verified' | 'verified'
  moods: Mood[]
  interests: Interest[]
  suitableFor: Company[]
  estimatedCost: { min: number; max: number } | null
}
