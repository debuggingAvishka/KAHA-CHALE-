
import type { Place } from '../../places/types'

const testPlaces: Place[] = [
  {
    id: 'test-001',
    name: 'Peaceful Garden',
    category: 'Nature',
    description: 'A quiet green space.',
    area: 'Test Area',
    imageUrl: '',
    moods: ['peaceful'],
    interests: ['nature'],
    suitableFor: ['solo', 'friends', 'family'],
    estimatedCost: { min: 0, max: 0 },
  },
  {
    id: 'test-002',
    name: 'Adventure Park',
    category: 'Adventure',
    description: 'An outdoor activity space.',
    area: 'Test Area',
    imageUrl: '',
    moods: ['adventurous', 'lively'],
    interests: ['adventure', 'nature'],
    suitableFor: ['friends', 'family'],
    estimatedCost: { min: 100, max: 180 },
  },
  {
    id: 'test-003',
    name: 'Premium Experience',
    category: 'Entertainment',
    description: 'A premium outing.',
    area: 'Test Area',
    imageUrl: '',
    moods: ['lively', 'romantic'],
    interests: ['art', 'shopping'],
    suitableFor: ['partner'],
    estimatedCost: { min: 600, max: 900 },
  },
  {
    id: 'test-004',
    name: 'Unknown Price Place',
    category: 'Nature',
    description: 'Pricing has not been verified.',
    area: 'Test Area',
    imageUrl: '',
    moods: ['peaceful'],
    interests: ['nature'],
    suitableFor: ['solo'],
    estimatedCost: null,
  },
]

export default testPlaces
