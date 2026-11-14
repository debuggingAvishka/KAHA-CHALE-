import { useState } from 'react'
import type { Place } from '../types'

interface PlaceCardProps { place: Place }
const categoryLabels: Record<string, string> = {
  nature_outdoors: 'Nature & Outdoors', food_cafes: 'Food & Cafes',
  accommodation: 'Accommodation', tourist_attraction: 'Tourist Attraction',
  historical_cultural: 'History & Culture', entertainment: 'Entertainment', shopping: 'Shopping',
}

function PlaceCard({ place }: PlaceCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !place.imageUrl || imageFailed
  const mapUrl = place.latitude !== null && place.longitude !== null
    ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`

  return (
    <article className="group overflow-hidden rounded-2xl border border-sand bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden bg-sand">
        {showFallback ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted" role="img" aria-label={`Image unavailable for ${place.name}`}>
            <span className="text-4xl" aria-hidden="true">📍</span>
            <span className="text-sm font-medium">Photo coming soon</span>
          </div>
        ) : (
          <img src={place.imageUrl} alt={`View of ${place.name}`} onError={() => setImageFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-semibold text-charcoal">{place.region}</span>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-terracotta">{categoryLabels[place.category] ?? place.category.replaceAll('_', ' ')}</p>
        <h3 className="mt-2 font-display text-2xl text-charcoal">{place.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted">{place.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand pt-4 text-sm">
          <span className="truncate text-muted">{place.area}</span>
          <a href={mapUrl} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-terracotta hover:underline">View map ↗</a>
        </div>
        <p className="mt-3 text-[11px] text-muted">{place.verificationStatus === 'verified' ? 'Verified details' : 'Listing details being verified'}{place.sourceUrl ? <> · <a href={place.sourceUrl} target="_blank" rel="noreferrer" className="underline">Source</a></> : null}</p>
      </div>
    </article>
  )
}
export default PlaceCard
