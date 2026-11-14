
import type { Place } from '../../places/types'
import type { QuizAnswers, BudgetRange } from '../types'

export interface RecommendedPlace {
    place: Place
    score: number
    reasons: string[]
}

// Maximum acceptable estimated cost for each budget selection.
const budgetLimits: Record<BudgetRange, number> = {
    free: 0,
    'under-200': 199,
    '200-500': 500,
    '500-plus': Infinity,
}

// Calculate how many selected preferences match a place.
function calculateMatch<T extends string>(
    selected: T[],
    available: T[],
): number {
    if (selected.length === 0) return 0

    const matched = selected.filter((item) =>
        available.includes(item)
    )

    return matched.length / selected.length
}

export function recommendPlaces(
    places: Place[],
    answers: QuizAnswers,
): RecommendedPlace[] {

    // Do not calculate recommendations for incomplete answers.
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

        // Unknown prices cannot be treated as free or affordable.
        if (place.estimatedCost === null) {
            continue
        }

        // Exclude places whose maximum estimated cost exceeds the budget.
        if (place.estimatedCost.max > maxBudget) {
            continue
        }

        const moodMatch = calculateMatch(
            answers.moods,
            place.moods,
        )

        const interestMatch = calculateMatch(
            answers.interests,
            place.interests,
        )

        const companyMatch = place.suitableFor.includes(
            answers.company
        ) ? 1 : 0

        // Weighted recommendation score.
        const score =
            moodMatch * 40 +
            companyMatch * 25 +
            interestMatch * 35

        // Don't recommend places with no preference matches.
        if (score === 0) {
            continue
        }

        const reasons: string[] = []

        const matchedMoods = answers.moods.filter((mood) =>
            place.moods.includes(mood),
        )

        const matchedInterests = answers.interests.filter((interest) =>
            place.interests.includes(interest),
        )

        if (matchedMoods.length > 0) {
            const moodLabels = matchedMoods.join(' and ')
            reasons.push(`Fits your ${moodLabels} mood`)
        }

        if (companyMatch > 0) {
            reasons.push(`Suitable for ${answers.company}`)
        }

        if (matchedInterests.length > 0) {
            const interestLabels = matchedInterests.join(' and ')
            reasons.push(`Matches your interest in ${interestLabels}`)
        }

        recommendations.push({
            place,
            score: Math.round(score),
            reasons,
        })
    }

    // Highest-scoring recommendations appear first.
    return recommendations.sort(
        (a, b) => b.score - a.score
    )
}
