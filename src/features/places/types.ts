
import type {
  Mood,
  Interest,
  Company,
} from '../recommendations/types'

export interface Place {
  id: string
  name: string
  category: string
  description: string
  area: string
  imageUrl: string

  moods: Mood[]
  interests: Interest[]
  suitableFor: Company[]

  estimatedCost: {
    min: number
    max: number
  } | null
}

