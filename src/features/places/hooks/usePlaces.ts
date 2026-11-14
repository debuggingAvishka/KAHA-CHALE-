import { useEffect, useState } from 'react'
import { places as localPlaces } from '../data/places'
import type { Place } from '../types'
import { fetchPublishedPlaces, isSupabaseConfigured } from '../../../lib/supabasePlaces'

type PlacesState = {
  places: Place[]
  loading: boolean
  source: 'supabase' | 'local'
  message: string | null
}

export function usePlaces(): PlacesState {
  const [state, setState] = useState<PlacesState>({
    places: localPlaces,
    loading: isSupabaseConfigured,
    source: 'local',
    message: isSupabaseConfigured ? null : 'Showing the bundled preview dataset. Configure Supabase to load published database listings.',
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    fetchPublishedPlaces()
      .then((remotePlaces) => {
        if (!active) return
        setState({
          places: remotePlaces.length > 0 ? remotePlaces : localPlaces,
          loading: false,
          source: remotePlaces.length > 0 ? 'supabase' : 'local',
          message: remotePlaces.length === 0
            ? 'Supabase is connected, but no listings are published yet. Showing the local preview while draft records remain private.'
            : null,
        })
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : 'Unknown Supabase connection error'
        setState({
          places: localPlaces,
          loading: false,
          source: 'local',
          message: `Could not load live listings. Showing the local preview dataset instead. ${message}`,
        })
      })

    return () => {
      active = false
    }
  }, [])

  return state
}
