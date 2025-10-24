import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalStorage } from './use-local-storage'

interface FavoriteCity {
  id: string
  name: string
  lat: number
  lon: number
  country: string
  state?: string
  addedAt: number
}

export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>('favorite-cities', [])

  const queryClient = useQueryClient()

  const favoriteQuery = useQuery({
    queryKey: ['favorite-cities'],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity
  })

  const addFavorite = useMutation({
    mutationFn: async (favorite: Omit<FavoriteCity, 'id' | 'addedAt'>) => {
      const newFavorite: FavoriteCity = {
        ...favorite,
        id: `${favorite.lat}-${favorite.lon}`,
        addedAt: Date.now()
      }

      const exists = favorites.some((fav) => fav.id === newFavorite.id)
      if (exists) {
        return favorites
      }

      const newFavorites = [...favorites, newFavorite].slice(0, 10)

      setFavorites(newFavorites)
      return newFavorites
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorite-cities']
      })
    }
  })

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((fav) => fav.id !== cityId)
      setFavorites(newFavorites)
      return newFavorites
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorite-cities']
      })
    }
  })

  return {
    favorites: favoriteQuery.data,
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) => {
      return favorites.some((fav) => fav.lat === lat && fav.lon === lon)
    }
  }
}
