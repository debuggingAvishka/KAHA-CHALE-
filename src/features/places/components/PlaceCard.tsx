
import { useState } from 'react'
import type { Place } from '../types'

interface PlaceCardProps {
    place: Place
}

function PlaceCard({ place }: PlaceCardProps) {
    const [imageFailed, setImageFailed] = useState(false)

    const showFallback = !place.imageUrl || imageFailed

    return (
        <article className="overflow-hidden rounded-xl border border-sand bg-white">
            <div className="relative h-56 w-full overflow-hidden bg-sand">
                {showFallback ? (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted"
                        role="img"
                        aria-label={`Image unavailable for ${place.name}`}
                    >
                        <span className="text-4xl" aria-hidden="true">
                            📍
                        </span>

                        <span className="text-sm font-medium">
                            Image coming soon
                        </span>
                    </div>
                ) : (
                    <img
                        src={place.imageUrl}
                        alt={`View of ${place.name}`}
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="p-5">
                <p className="text-sm font-medium text-terracotta">
                    {place.category}
                </p>

                <h3 className="mt-2 font-display text-2xl text-charcoal">
                    {place.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                    {place.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted">{place.area}</span>

                    <span className="font-medium text-charcoal">
                        {place.estimatedCost
                            ? `₹${place.estimatedCost.min}–₹${place.estimatedCost.max}`
                            : 'Pricing unverified'}
                    </span>
                </div>
            </div>
        </article>
    )
}

export default PlaceCard
