import type { Place } from '../features/places/types'

type SupabasePlaceRow = {
  id: string
  name: string
  description: string | null
  latitude: number | null
  longitude: number | null
  address: string | null
  area: string | null
  estimated_cost_min: number | null
  estimated_cost_max: number | null
  verification_status: Place['verificationStatus']
  category_id: string
  locality_id: string | null
}

type LookupRow = { id: string; name: string; slug?: string; locality_type?: string }

type SupabasePlaceImageRow = {
  place_id: string
  image_url: string
  attribution: string | null
  source_page_url: string | null
  licence: string | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

async function selectRows<T>(table: string, query: string): Promise<T[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Supabase ${table} request failed (${response.status}): ${detail}`)
  }

  return response.json() as Promise<T[]>
}

const featuredNames = new Set([
  'Dhuandhar Falls',
  'Marble Rocks',
  'Madan Mahal Fort',
  'Balancing Rock',
  'Bargi dam',
  'Bargi Dam',
  'Singorgarh Fort',
  'Veerangana Durgavati Wildlife Sanctuary',
])

function toRegion(localityName: string | null, placeName: string): Place['region'] {
  if (placeName === 'Singorgarh Fort' || placeName === 'Veerangana Durgavati Wildlife Sanctuary') {
    return 'Extended trip'
  }
  const locality = localityName?.toLowerCase()
  if (locality === 'bhedaghat') return 'Nearby'
  if (locality === 'jabalpur') return 'Jabalpur'
  if (['Dhuandhar Falls', 'Marble Rocks', 'Bargi dam', 'Bargi Dam'].includes(placeName)) {
    return 'Nearby'
  }
  return 'To be verified'
}

export async function fetchPublishedPlaces(): Promise<Place[]> {
  const [rows, categories, localities] = await Promise.all([
    selectRows<SupabasePlaceRow>(
      'places',
      'select=id,name,description,latitude,longitude,address,area,estimated_cost_min,estimated_cost_max,verification_status,category_id,locality_id&listing_status=eq.published&order=name.asc',
    ),
    selectRows<LookupRow>('place_categories', 'select=id,name,slug'),
    selectRows<LookupRow>('localities', 'select=id,name,locality_type'),
  ])

  const imageRows = rows.length > 0
    ? await selectRows<SupabasePlaceImageRow>(
        'place_images',
        `select=place_id,image_url,attribution,source_page_url,licence&place_id=in.(${rows.map((row) => row.id).join(',')})&is_primary=eq.true&verification_status=eq.verified`,
      )
    : []

  const categoryById = new Map(categories.map((item) => [item.id, item.slug ?? item.name]))
  const localityById = new Map(localities.map((item) => [item.id, item.name]))
  const imageByPlaceId = new Map<string, SupabasePlaceImageRow>()
  for (const image of imageRows) {
    if (!imageByPlaceId.has(image.place_id)) imageByPlaceId.set(image.place_id, image)
  }

  return rows.map((row) => {
    const locality = row.locality_id ? localityById.get(row.locality_id) ?? null : null
    const category = categoryById.get(row.category_id) ?? 'other'
    const area = row.area ?? row.address ?? locality ?? 'Jabalpur region'
    const image = imageByPlaceId.get(row.id)
    return {
      id: row.id,
      name: row.name,
      category,
      description: row.description ?? 'Visitor details are awaiting verification.',
      area,
      region: toRegion(locality, row.name),
      imageUrl: image?.image_url ?? '',
      imageAttribution: image?.attribution ?? undefined,
      imageSourceUrl: image?.source_page_url ?? undefined,
      imageLicence: image?.licence ?? undefined,
      latitude: row.latitude,
      longitude: row.longitude,
      sourceUrl: undefined,
      verificationStatus: row.verification_status ?? 'unverified',
      moods: [],
      interests: [],
      suitableFor: [],
      estimatedCost: row.estimated_cost_min !== null && row.estimated_cost_max !== null
        ? { min: row.estimated_cost_min, max: row.estimated_cost_max }
        : null,
    }
  })
}

export function isFeaturedPlace(place: Place): boolean {
  return featuredNames.has(place.name)
}
