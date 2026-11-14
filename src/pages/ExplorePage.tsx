
import FeaturedPlaces from '../features/places/components/FeaturedPlaces'

function ExplorePage() {
    return (
        <main className="min-h-screen bg-ivory px-6 py-16 md:px-8">
            <div className="mx-auto max-w-6xl">
                <p className="font-semibold tracking-widest text-terracotta">
                    FIND YOUR NEXT DESTINATION
                </p>

                <h1 className="mt-3 font-display text-4xl text-charcoal">
                    Explore Jabalpur
                </h1>

                <p className="mt-3 text-muted">
                    From city landmarks to nearby escapes and extended trips, find a place for your kind of day.
                </p>

                <div className="mt-12">
                    <FeaturedPlaces showHeading={false} />
                </div>
            </div>
        </main>
    )
}

export default ExplorePage
