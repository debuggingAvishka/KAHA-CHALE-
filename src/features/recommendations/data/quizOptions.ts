
import type {
  Mood,
  Interest,
  Company,
  BudgetRange,
  QuizOption,
} from '../types'

export const moodOptions: QuizOption<Mood>[] = [
  {
    value: 'peaceful',
    label: 'Peaceful',
    description: 'Quiet places and nature',
    icon: '🌿',
  },
  {
    value: 'cozy',
    label: 'Cozy',
    description: 'Cafés and conversations',
    icon: '☕',
  },
  {
    value: 'adventurous',
    label: 'Adventurous',
    description: 'Exploration and activities',
    icon: '🎒',
  },
  {
    value: 'romantic',
    label: 'Romantic',
    description: 'Special experiences for two',
    icon: '❤️',
  },
  {
    value: 'lively',
    label: 'Lively',
    description: 'Fun and social outings',
    icon: '🎉',
  },
  {
    value: 'cultural',
    label: 'Cultural',
    description: 'History, art and heritage',
    icon: '🏛️',
  },
]

export const interestOptions: QuizOption<Interest>[] = [
  { value: 'nature', label: 'Nature', description: 'Parks, lakes and scenery', icon: '🌳' },
  { value: 'food', label: 'Food & Cafés', description: 'Restaurants and coffee', icon: '🍽️' },
  { value: 'history', label: 'History', description: 'Forts and heritage', icon: '🏰' },
  { value: 'shopping', label: 'Shopping', description: 'Markets and malls', icon: '🛍️' },
  { value: 'adventure', label: 'Adventure', description: 'Outdoor activities', icon: '🧭' },
  { value: 'art', label: 'Art & Culture', description: 'Museums and creative spaces', icon: '🎨' },
]

export const companyOptions: QuizOption<Company>[] = [
  { value: 'solo', label: 'Solo', description: 'A little time for yourself', icon: '🚶' },
  { value: 'friends', label: 'Friends', description: 'A day out together', icon: '👥' },
  { value: 'partner', label: 'Partner', description: 'Quality time together', icon: '💑' },
  { value: 'family', label: 'Family', description: 'Something for everyone', icon: '👨‍👩‍👧' },
]

export const budgetOptions: QuizOption<BudgetRange>[] = [
  { value: 'free', label: 'Free', description: 'No entry or activity cost', icon: '🆓' },
  { value: 'under-200', label: 'Under ₹200', description: 'Keep it affordable', icon: '₹' },
  { value: '200-500', label: '₹200–₹500', description: 'A little more to spend', icon: '₹₹' },
  { value: '500-plus', label: '₹500+', description: 'Open to premium experiences', icon: '₹₹₹' },
]
