import { useMemo, useState } from 'react'
import { usePlaces } from '../hooks/usePlaces'
import { isFeaturedPlace } from '../../../lib/supabasePlaces'
import PlaceCard from './PlaceCard'

interface FeaturedPlacesProps { showHeading?: boolean }
const categories = [
  { value: 'all', label: 'All places' },
  { value: 'nature_outdoors', label: 'Nature' },
  { value: 'tourist_attraction', label: 'Attractions' },
  { value: 'historical_cultural', label: 'History' },
  { value: 'food_cafes', label: 'Food & Cafes' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'accommodation', label: 'Stay' },
]

function FeaturedPlaces({ showHeading = true }: FeaturedPlacesProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [region, setRegion] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const { places, loading, source, message } = usePlaces()

  const featured = useMemo(() => places.filter(isFeaturedPlace), [places])
  const filtered = useMemo(() => places.filter((place) => {
    const matchesQuery = `${place.name} ${place.area} ${place.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (category === 'all' || place.category === category) && (region === 'all' || place.region === region)
  }), [query, category, region])
  const isFiltering = query.trim() !== '' || category !== 'all' || region !== 'all'
  const visible = isFiltering ? filtered : (showAll ? places : featured)

  return (
    <section id="explore" className="px-6 py-16 md:px-8">
      {showHeading && <div className="mx-auto mb-10 max-w-6xl">
        <p className="text-sm font-semibold tracking-widest text-terracotta">PLACES WORTH DISCOVERING</p>
        <h2 className="mt-3 font-display text-4xl text-charcoal">Explore the Jabalpur region</h2>
        <p className="mt-3 max-w-2xl text-muted">From familiar city landmarks to day trips beyond the city. Start with these highlights or search the growing directory.</p>
      </div>}

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-3 py-1 font-semibold ${source === 'supabase' ? 'bg-green-100 text-green-800' : 'bg-sand text-charcoal'}`}>
            {source === 'supabase' ? 'Live database' : 'Preview data'}
          </span>
          {loading && <span className="text-muted">Connecting to Supabase…</span>}
          {message && <p className="w-full rounded-lg border border-sand bg-white px-4 py-3 leading-relaxed text-muted">{message}</p>}
        </div>
        <div className="mb-7 flex flex-col gap-3 lg:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search places</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search places, areas or experiences..." className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta" />
          </label>
          <label className="lg:w-56">
            <span className="sr-only">Filter by region</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm">
              <option value="all">All regions</option><option value="Jabalpur">Jabalpur city</option><option value="Nearby">Nearby escapes</option><option value="Extended trip">Extended trips</option><option value="To be verified">Locality to be verified</option>
            </select>
          </label>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => <button key={item.value} type="button" onClick={() => setCategory(item.value)} className={`rounded-full border px-4 py-2 text-sm transition ${category === item.value ? 'border-charcoal bg-charcoal text-white' : 'border-sand bg-white text-charcoal hover:border-terracotta'}`}>{item.label}</button>)}
        </div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{isFiltering ? `${filtered.length} matching places` : showAll ? `${places.length} listed places` : `${featured.length} highlighted places`}</p>
          {!isFiltering && <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm font-semibold text-terracotta hover:underline">{showAll ? 'Show highlights' : 'Browse all places'} →</button>}
        </div>
        {visible.length ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map((place) => <PlaceCard key={place.id} place={place} />)}</div> : <div className="rounded-2xl border border-dashed border-sand bg-white px-6 py-12 text-center"><p className="font-display text-2xl">{source === 'supabase' && places.length === 0 ? 'No published places yet' : 'No places found'}</p><p className="mt-2 text-sm text-muted">{source === 'supabase' && places.length === 0 ? 'Your draft records are safely hidden until they are published.' : 'Try another name or remove a filter.'}</p><button onClick={() => { setQuery(''); setCategory('all'); setRegion('all') }} className="mt-4 text-sm font-semibold text-terracotta">Clear filters</button></div>}
        <p className="mt-8 text-xs leading-relaxed text-muted">Place coverage is still being reviewed. Opening hours, prices, accessibility and visitor access are not assumed when unverified. Open the map and confirm details before travelling.</p>
      </div>
    </section>
  )
}
export default FeaturedPlaces
