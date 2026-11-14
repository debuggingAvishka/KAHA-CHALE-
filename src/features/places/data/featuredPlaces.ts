
import type { Place } from '../types'

const featuredPlaces: Place[] = [
  {
    id: 'place-001',
    name: 'Bhedaghat',
    category: 'Nature',
    description: 'Explore the magnificent marble rocks along the Narmada River.',
    area: 'Bhedaghat',
    imageUrl: '/images/bhedaghat.jpeg',
    moods: ['peaceful', 'adventurous', 'romantic'],
    interests: ['nature', 'adventure'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
    estimatedCost: null,
  },
  {
    id: 'place-002',
    name: 'Dhuandhar Falls',
    category: 'Waterfall',
    description: 'Experience the spectacular waterfall and surrounding natural scenery.',
    area: 'Bhedaghat',
    imageUrl: '/images/dhuandhar.jpeg',
    moods: ['peaceful', 'adventurous'],
    interests: ['nature', 'adventure'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
    estimatedCost: null,
  },
  {
    id: 'place-003',
    name: 'Madan Mahal Fort',
    category: 'Historical',
    description: 'Discover a historic hilltop fort overlooking Jabalpur.',
    area: 'Madan Mahal',
    imageUrl: '/images/madan-mahal.jpeg',
    moods: ['cultural', 'adventurous'],
    interests: ['history', 'art'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
    estimatedCost: null,
  },
]

export default featuredPlaces
