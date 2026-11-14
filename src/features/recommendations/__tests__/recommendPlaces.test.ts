
import { describe, it, expect } from 'vitest'
import { recommendPlaces } from '../utils/recommendPlaces'
import type { Place } from '../../places/types'
import type { QuizAnswers } from '../types'

const testPlaces: Place[] = [
  {
    id: 'test-001',
    name: 'Peaceful Garden',
    category: 'Nature',
    description: 'A quiet green space.',
    area: 'Test Area',
    imageUrl: '',
    region: 'Jabalpur', latitude: null, longitude: null, verificationStatus: 'unverified',
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
    region: 'Jabalpur', latitude: null, longitude: null, verificationStatus: 'unverified',
    moods: ['adventurous', 'lively'],
    interests: ['adventure', 'nature'],
    suitableFor: ['friends', 'family'],
    estimatedCost: { min: 100, max: 180 },
  },
  {
    id: 'test-003',
    name: 'Premium Experience',
    category: 'Entertainment',
    description: 'A premium experience.',
    area: 'Test Area',
    imageUrl: '',
    region: 'Jabalpur', latitude: null, longitude: null, verificationStatus: 'unverified',
    moods: ['lively', 'romantic'],
    interests: ['art', 'shopping'],
    suitableFor: ['partner'],
    estimatedCost: { min: 600, max: 900 },
  },
  {
    id: 'test-004',
    name: 'Unknown Price Place',
    category: 'Nature',
    description: 'A place with unverified pricing.',
    area: 'Test Area',
    imageUrl: '',
    region: 'Jabalpur', latitude: null, longitude: null, verificationStatus: 'unverified',
    moods: ['peaceful'],
    interests: ['nature'],
    suitableFor: ['solo'],
    estimatedCost: null,
  },
]

const answers: QuizAnswers = {
  moods: ['peaceful', 'adventurous'],
  interests: ['nature', 'adventure'],
  company: 'friends',
  budget: 'under-200',
}

describe('recommendPlaces', () => {

  it('includes only zero-cost places for the free budget', () => {
    const freeAnswers: QuizAnswers = {
      ...answers,
      budget: 'free',
    }

    const results = recommendPlaces(testPlaces, freeAnswers)

    expect(results).toHaveLength(1)
    expect(results[0].place.name).toBe('Peaceful Garden')
  })

  it('handles the under-200 budget boundary correctly', () => {
    const boundaryPlaces: Place[] = [
      {
        ...testPlaces[1],
        id: 'test-005',
        name: '₹199 Place',
        estimatedCost: { min: 100, max: 199 },
      },
      {
        ...testPlaces[1],
        id: 'test-006',
        name: '₹200 Place',
        estimatedCost: { min: 100, max: 200 },
      },
    ]

    const results = recommendPlaces(boundaryPlaces, answers)

    expect(results).toHaveLength(1)
    expect(results[0].place.name).toBe('₹199 Place')
  })

  it('ranks places by match score', () => {
    const results = recommendPlaces(testPlaces, answers)

    expect(results).toHaveLength(2)
    expect(results[0].place.name).toBe('Adventure Park')
    expect(results[0].score).toBe(80)
    expect(results[1].place.name).toBe('Peaceful Garden')
    expect(results[1].score).toBe(63)
  })

  it('excludes places exceeding the selected budget', () => {
    const results = recommendPlaces(testPlaces, answers)

    expect(
      results.some((result) => result.place.id === 'test-003'),
    ).toBe(false)
  })

  it('excludes places with unknown pricing', () => {
    const results = recommendPlaces(testPlaces, answers)

    expect(
      results.some((result) => result.place.id === 'test-004'),
    ).toBe(false)
  })

  it('returns no results for incomplete answers', () => {
    const incompleteAnswers: QuizAnswers = {
      ...answers,
      company: null,
    }

    const results = recommendPlaces(testPlaces, incompleteAnswers)

    expect(results).toEqual([])
  })

  it('returns an empty array when there are no places', () => {
    const results = recommendPlaces([], answers)

    expect(results).toEqual([])
  })
})
