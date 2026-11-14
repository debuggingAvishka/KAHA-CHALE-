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
  estimated_cost: { min: number; max: number } | null
  source_url?: string
  verification_status?: string
  source_dataset?: string | string[]
  address?: { city?: string | null }
  original_tags: Record<string, string | undefined>
}
interface RawDataset { records: RawPlace[] }
const dataset = rawData as RawDataset

const curated: Record<string, Partial<Place>> = {
  'node/3912800238': {
    description: 'A powerful cascade on the Narmada River at Bhedaghat, known for the mist rising around the falls.',
    area: 'Bhedaghat', region: 'Nearby', imageUrl: '/images/dhuandhar.jpeg',
    moods: ['peaceful', 'adventurous'], interests: ['nature', 'adventure'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
  },
  'node/7890165908': {
    description: 'A dramatic stretch of the Narmada framed by towering marble cliffs at Bhedaghat.',
    area: 'Bhedaghat', region: 'Nearby', imageUrl: '/images/bhedaghat.jpeg',
    moods: ['peaceful', 'romantic', 'adventurous'], interests: ['nature', 'adventure'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
  },
  'node/14289276875': {
    description: 'A historic hilltop fort associated with the Gond rulers, set above the city.',
    area: 'Madan Mahal', region: 'Jabalpur', imageUrl: '/images/madan-mahal.jpeg',
    moods: ['cultural', 'adventurous'], interests: ['history', 'art'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
  },
  'node/14289276859': {
    description: 'A striking natural rock formation balanced near Madan Mahal, worth pairing with the fort.',
    area: 'Madan Mahal', region: 'Jabalpur',
    moods: ['peaceful', 'adventurous'], interests: ['nature', 'adventure'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
  },
  'relation/397067': {
    description: 'A large reservoir on the Narmada, popular as a scenic destination outside the city.',
    area: 'Bargi', region: 'Nearby',
    moods: ['peaceful', 'adventurous'], interests: ['nature', 'adventure'],
    suitableFor: ['friends', 'partner', 'family'],
  },
}

const basePlaces: Place[] = dataset.records
  .filter((r) => r.name && r.latitude !== null && r.longitude !== null)
  .map((r) => {
    const curatedPlace = curated[r.id] ?? {}
    const area = curatedPlace.area ?? r.address?.city ?? 'Jabalpur region'
    const region = curatedPlace.region ?? (r.source_dataset?.toString().includes('regional') ? 'Nearby' : 'To be verified')
    return {
      id: r.id,
      name: r.name!,
      category: r.category,
      description: curatedPlace.description ?? r.original_tags.description ?? `${r.name} is listed in OpenStreetMap. Visitor details are awaiting verification.`,
      area,
      region,
      imageUrl: curatedPlace.imageUrl ?? r.image_url ?? '',
      latitude: r.latitude,
      longitude: r.longitude,
      sourceUrl: r.source_url,
      verificationStatus: r.verification_status === 'verified' ? 'verified' : 'unverified',
      moods: curatedPlace.moods ?? [],
      interests: curatedPlace.interests ?? [],
      suitableFor: curatedPlace.suitableFor ?? [],
      estimatedCost: r.estimated_cost,
    }
  })

const regionalAdditions: Place[] = [
  {
    id: 'way/1245179888', name: 'Singorgarh Fort', category: 'historical_cultural',
    description: 'Historic fort ruins in the Singrampur area, associated with Gond history and Rani Durgavati.',
    area: 'Singrampur, Damoh district', region: 'Extended trip', imageUrl: '',
    latitude: 23.5375556, longitude: 79.7476434,
    sourceUrl: 'https://www.openstreetmap.org/way/1245179888', verificationStatus: 'unverified',
    moods: ['cultural', 'adventurous'], interests: ['history', 'art'], suitableFor: ['solo', 'friends', 'family'], estimatedCost: null,
  },
  {
    id: 'way/669501998', name: 'Veerangana Durgavati Wildlife Sanctuary', category: 'nature_outdoors',
    description: 'A protected forest landscape and wildlife destination in the wider Jabalpur region. Check access and safari details before travelling.',
    area: 'Damoh region', region: 'Extended trip', imageUrl: '',
    latitude: 23.5351458, longitude: 79.7682309,
    sourceUrl: 'https://www.openstreetmap.org/way/669501998', verificationStatus: 'unverified',
    moods: ['peaceful', 'adventurous'], interests: ['nature', 'adventure'], suitableFor: ['friends', 'partner', 'family'], estimatedCost: null,
  },
]

export const places: Place[] = [...basePlaces, ...regionalAdditions]
  .filter((place, index, all) => all.findIndex((p) => p.id === place.id) === index)
  .sort((a, b) => a.name.localeCompare(b.name))

export const featuredPlaceIds = [
  'node/3912800238', 'node/7890165908', 'node/14289276875',
  'node/14289276859', 'relation/397067', 'way/1245179888', 'way/669501998',
]
