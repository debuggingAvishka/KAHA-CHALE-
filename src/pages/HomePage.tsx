
import Hero from '../components/layout/Hero'
import FeaturedPlaces from '../features/places/components/FeaturedPlaces'
import MoodQuiz from '../features/recommendations/components/MoodQuiz'

function HomePage() {
    return (
        <main>
            <Hero />
            <FeaturedPlaces />
            <MoodQuiz />
        </main>
    )
}

export default HomePage
