import { useState } from 'react'
import { usePlaces } from '../../places/hooks/usePlaces'


import {
    recommendPlaces,
    type RecommendedPlace,
} from '../utils/recommendPlaces'

import PlaceCard from '../../places/components/PlaceCard'



import type {
    Mood,
    Interest,
    Company,
    BudgetRange,
    QuizAnswers,
    QuizOption,
} from '../types'

import {
    moodOptions,
    interestOptions,
    companyOptions,
    budgetOptions,
} from '../data/quizOptions'

// Reusable helper for multiple selections
function toggleSelection<T>(items: T[], value: T): T[] {
    return items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value]
}

// Reusable option card
interface OptionCardProps<T extends string> {
    option: QuizOption<T>
    selected: boolean
    onClick: () => void
}

function OptionCard<T extends string>({
    option,
    selected,
    onClick,
}: OptionCardProps<T>) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`rounded-xl border p-4 text-left transition-all ${selected
                ? 'border-terracotta bg-terracotta/10'
                : 'border-sand bg-white hover:border-terracotta'
                }`}
        >
            <span className="text-2xl">{option.icon}</span>

            <h3 className="mt-3 font-semibold text-charcoal">
                {option.label}
            </h3>

            <p className="mt-1 text-sm text-muted">
                {option.description}
            </p>
        </button>
    )
}

function MoodQuiz() {
    const { places, loading, source, message } = usePlaces()
    const [moods, setMoods] = useState<Mood[]>([])
    const [interests, setInterests] = useState<Interest[]>([])
    const [company, setCompany] = useState<Company | null>(null)
    const [budget, setBudget] = useState<BudgetRange | null>(null)
    const [recommendations, setRecommendations] =
        useState<RecommendedPlace[] | null>(null)
    const answers: QuizAnswers = {
        moods,
        interests,
        company,
        budget,
    }
    const isComplete =
        answers.moods.length > 0 &&
        answers.interests.length > 0 &&
        answers.company !== null &&
        answers.budget !== null
    const resetQuiz = () => {
        setMoods([])
        setInterests([])
        setCompany(null)
        setBudget(null)
        setRecommendations(null)
    }
    return (
        <section className="bg-ivory px-8 py-16" id="discover">
            <div className="mx-auto max-w-6xl">

                <p className="text-sm font-semibold tracking-widest text-terracotta">
                    MAKE IT YOUR KIND OF DAY
                </p>

                <h2 className="mt-3 font-display text-4xl text-charcoal">
                    What are you in the mood for?
                </h2>

                <p className="mt-3 text-muted">
                    Tell us a little about your plans. We'll help you find somewhere to go.
                </p>
                {loading && (
                    <p className="mt-4 text-sm text-muted" role="status">
                        Loading places from our directory...
                    </p>
                )}

                {!loading && (
                    <div className="mt-4 text-sm text-muted" role="status">
                        <p>
                            {source === 'supabase'
                                ? 'Recommendations are using published places from our live directory.'
                                : 'Preview mode: recommendations are using the bundled sample dataset.'}
                        </p>

                        {message && (
                            <p className="mt-1">{message}</p>
                        )}
                    </div>
                )}

                {/* Mood selection */}
                <div className="mt-12">
                    <h3 className="mb-5 text-xl font-semibold text-charcoal">
                        01. Choose your moods
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {moodOptions.map((option) => (
                            <OptionCard
                                key={option.value}
                                option={option}
                                selected={moods.includes(option.value)}
                                onClick={() =>
                                    setMoods((current) =>
                                        toggleSelection(current, option.value)
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Company selection */}
                <div className="mt-12">
                    <h3 className="mb-5 text-xl font-semibold text-charcoal">
                        02. Who are you going with?
                    </h3>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {companyOptions.map((option) => (
                            <OptionCard
                                key={option.value}
                                option={option}
                                selected={company === option.value}
                                onClick={() => setCompany(option.value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Budget selection */}
                <div className="mt-12">
                    <h3 className="mb-5 text-xl font-semibold text-charcoal">
                        03. What's your budget?
                    </h3>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {budgetOptions.map((option) => (
                            <OptionCard
                                key={option.value}
                                option={option}
                                selected={budget === option.value}
                                onClick={() => setBudget(option.value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Interest selection */}
                <div className="mt-12">
                    <h3 className="mb-5 text-xl font-semibold text-charcoal">
                        04. What interests you?
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {interestOptions.map((option) => (
                            <OptionCard
                                key={option.value}
                                option={option}
                                selected={interests.includes(option.value)}
                                onClick={() =>
                                    setInterests((current) =>
                                        toggleSelection(current, option.value)
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Selection status */}
                <div className="mt-10 rounded-xl border border-sand bg-white p-5">
                    <p className="font-semibold text-charcoal">
                        {isComplete
                            ? 'Your preferences are ready!'
                            : 'A little more about your plans'}
                    </p>

                    <p className="mt-2 text-sm text-muted">
                        {moods.length} moods · {interests.length} interests ·
                        {company ? ' Company selected' : ' Company pending'} ·
                        {budget ? ' Budget selected' : ' Budget pending'}
                    </p>
                </div>
                <button
                    type="button"
                    disabled={!isComplete || loading || places.length === 0}
                    onClick={() => {
                        setRecommendations(recommendPlaces(places, answers))
                    }}
                    className="mt-6 rounded-md bg-terracotta px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {loading ? 'Loading places...' : 'Find my places'}
                </button>

                {recommendations !== null && (
                    <section className="mt-16" aria-live="polite">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold tracking-widest text-terracotta">
                                    CURATED FOR YOUR DAY
                                </p>

                                <h2 className="mt-2 font-display text-3xl text-charcoal">
                                    Your recommendations
                                </h2>

                                <p className="mt-2 text-sm text-muted">
                                    Based on your selected moods, interests, company and budget.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetQuiz}
                                className="rounded-md border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition hover:bg-terracotta hover:text-white"
                            >
                                Retake quiz
                            </button>
                        </div>

                        {recommendations.length === 0 ? (
                            <div className="mt-8 rounded-xl border border-sand bg-white p-6">
                                <h3 className="font-semibold text-charcoal">
                                    No matching places just yet.
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    We couldn't find verified places matching all your
                                    preferences and budget. Try adjusting your budget
                                    or choosing different interests.
                                </p>

                                <button
                                    type="button"
                                    onClick={resetQuiz}
                                    className="mt-5 rounded-md bg-terracotta px-5 py-2.5 text-sm text-white"
                                >
                                    Try different preferences
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="mt-6 text-sm text-muted">
                                    We found {recommendations.length} matching places.
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {recommendations.map((result) => (
                                        <article
                                            key={result.place.id}
                                            className="rounded-xl border border-sand bg-white p-3"
                                        >
                                            <PlaceCard place={result.place} />

                                            <div className="mt-4 px-2 pb-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-charcoal">
                                                        Your match
                                                    </span>

                                                    <span className="text-lg font-bold text-terracotta">
                                                        {result.score}%
                                                    </span>
                                                </div>

                                                <div
                                                    className="mt-2 h-2 overflow-hidden rounded-full bg-sand"
                                                    role="progressbar"
                                                    aria-label={`Match score for ${result.place.name}`}
                                                    aria-valuenow={result.score}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                >
                                                    <div
                                                        className="h-full rounded-full bg-terracotta transition-all"
                                                        style={{ width: `${result.score}%` }}
                                                    />
                                                </div>

                                                <h4 className="mt-5 text-sm font-semibold text-charcoal">
                                                    Why this place?
                                                </h4>

                                                <ul className="mt-2 space-y-2 text-sm text-muted">
                                                    {result.reasons.map((reason) => (
                                                        <li key={reason}>
                                                            <span className="mr-2 text-terracotta">
                                                                ✓
                                                            </span>
                                                            {reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                )}
            </div>
        </section>
    )
}

export default MoodQuiz
