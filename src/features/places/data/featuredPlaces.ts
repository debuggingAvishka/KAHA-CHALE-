
import type { Place } from '../types'

const featuredPlaces: Place[] = [
  {
    id: 'place-001',
    name: 'Bhedaghat',
    category: 'Nature',
    description: 'Explore the magnificent marble rocks along the Narmada River.',
    area: 'Bhedaghat',
    imageUrl: '/images/bhedaghat.jpeg',
    region: 'Nearby', latitude: 23.1298959, longitude: 79.795089, verificationStatus: 'unverified',
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
    region: 'Nearby', latitude: 23.125398, longitude: 79.8134415, verificationStatus: 'unverified',
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
    region: 'Jabalpur', latitude: 23.148382, longitude: 79.9017419, verificationStatus: 'unverified',
    moods: ['cultural', 'adventurous'],
    interests: ['history', 'art'],
    suitableFor: ['solo', 'friends', 'partner', 'family'],
    estimatedCost: null,
  },
]

export default featuredPlaces
