
import type { Place } from '../../places/types'
import type { QuizAnswers, BudgetRange, Interest } from '../types'

export interface RecommendedPlace {
    place: Place
    score: number
    reasons: string[]
    priceUnknown: boolean
}

const budgetLimits: Record<BudgetRange, number> = {
    free: 0,
    'under-200': 199,
    '200-500': 500,
    '500-plus': Infinity,
}

// Category associations are broad discovery signals, not
// claims about every activity available at a place.
const categoryInterests: Record<string, Interest[]> = {
    nature_outdoors: ['nature', 'adventure'],
    food_cafes: ['food'],
    historical_cultural: ['history', 'art'],
    shopping: ['shopping'],
}

function getPlaceInterests(place: Place): Interest[] {
    const category = categoryInterests[place.category] ?? []
    return [...new Set([...place.interests, ...category])]
}

function calculateMatch<T extends string>(
    selected: T[],
    available: T[],
): number {
    if (selected.length === 0) return 0

    const matched = selected.filter((item) =>
        available.includes(item),
    )

    return matched.length / selected.length
}

export function recommendPlaces(
    places: Place[],
    answers: QuizAnswers,
): RecommendedPlace[] {
    if (
        answers.moods.length === 0 ||
        answers.interests.length === 0 ||
        !answers.company ||
        !answers.budget
    ) {
        return []
    }

    const maxBudget = budgetLimits[answers.budget]
    const recommendations: RecommendedPlace[] = []

    for (const place of places) {
        const priceUnknown = place.estimatedCost === null

        // Exclude only places whose known maximum cost exceeds
        // the selected budget. Unknown costs remain eligible.
        if (
            place.estimatedCost !== null &&
            place.estimatedCost.max > maxBudget
        ) {
            continue
        }

        const placeInterests = getPlaceInterests(place)

        const matchedMoods = answers.moods.filter((mood) =>
            place.moods.includes(mood),
        )

        const matchedInterests = answers.interests.filter((interest) =>
            placeInterests.includes(interest),
        )

        const companyMatch = place.suitableFor.includes(
            answers.company,
        )

        // Only score dimensions for which the place has
        // actual matching metadata.

        const moodScore = place.moods.length > 0
            ? calculateMatch(answers.moods, place.moods) * 40
            : 0

        const interestScore = placeInterests.length > 0
            ? calculateMatch(answers.interests, placeInterests) * 35
            : 0

        const companyScore = place.suitableFor.length > 0
            ? (companyMatch ? 25 : 0)
            : 0

        // Fixed denominator: missing evidence cannot inflate the score.
        const score = Math.round(
            moodScore + interestScore + companyScore,
        )

        // Require at least one supported preference match.
        if (score === 0) continue
        const reasons: string[] = []

        if (matchedMoods.length > 0) {
            reasons.push(
                `Fits your ${matchedMoods.join(' and ')} mood`,
            )
        }

        if (matchedInterests.length > 0) {
            reasons.push(
                `Matches your interest in ${matchedInterests.join(' and ')}`,
            )
        }

        if (companyMatch) {
            reasons.push(`Suitable for ${answers.company}`)
        }

        if (priceUnknown) {
            reasons.push('Estimated cost is not available')
        }

        recommendations.push({
            place,
            score,
            reasons,
            priceUnknown,
        })
    }

    return recommendations.sort(
        (a, b) => b.score - a.score,
    )
}
