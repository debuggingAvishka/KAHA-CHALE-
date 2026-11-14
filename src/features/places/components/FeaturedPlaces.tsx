import { places } from '../data/places'
import PlaceCard from './PlaceCard'

interface FeaturedPlacesProps {
    showHeading?: boolean
}

function FeaturedPlaces({
    showHeading = true,
}: FeaturedPlacesProps) {
    return (
        <section id="explore" className="px-8 py-16">
            {showHeading && (
                <div className="mb-10">
                    <p className="text-sm font-semibold tracking-widest text-terracotta">
                        PLACES WORTH DISCOVERING
                    </p>

                    <h2 className="mt-3 font-display text-4xl text-charcoal">
                        Explore Jabalpur
                    </h2>

                    <p className="mt-3 text-muted">
                        A few places to begin your next adventure.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                ))}
            </div>
        </section>
    )
}

export default FeaturedPlaces
