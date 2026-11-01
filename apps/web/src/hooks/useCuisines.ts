import { useQuery } from '@tanstack/react-query'
import { fetchRecipes } from '@/lib/recipes'

export function useCuisines() {
  return useQuery({
    queryKey: ['cuisines'],
    queryFn: async () => {
      const recipes = await fetchRecipes()
      return [...new Set(recipes.map((r) => r.cuisine))].sort()
    },
  })
}
