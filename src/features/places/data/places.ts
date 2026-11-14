
import rawData from '../../../data/places.cleaned.json'
import type { Place } from '../types'

interface RawPlace {
  id: string
  name: string | null
  category: string
  latitude: number | null
  longitude: number | null
  opening_hours: string | null
  image_url: string | null
  estimated_cost: {
    min: number
    max: number
  } | null
  original_tags: Record<string, string | undefined>
}

interface RawDataset {
  records: RawPlace[]
}

const dataset = rawData as RawDataset

export const places: Place[] = dataset.records
  .filter(
    (record) =>
      record.name !== null &&
      record.latitude !== null &&
      record.longitude !== null
  )
  .map((record) => ({
    id: record.id,
    name: record.name!,
    category: record.category,
    description:
      record.original_tags.description ??
      `Discover ${record.name} in Jabalpur.`,
    area: 'Jabalpur',
    imageUrl: record.image_url ?? '',
    moods: [],
    interests: [],
    suitableFor: [],
    estimatedCost: record.estimated_cost,
  }))
