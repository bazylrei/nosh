import { api } from './api'
import type { Recipe, MealType, Dietary } from '@nosh/shared'

export interface RecipeFilters {
  search?: string
  mealType?: MealType
  dietary?: Dietary[]
  cuisine?: string
}

export function fetchRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.mealType) params.set('mealType', filters.mealType)
  if (filters.cuisine) params.set('cuisine', filters.cuisine)
  filters.dietary?.forEach((d) => params.append('dietary', d))
  const qs = params.toString()
  return api.get(`/api/recipes${qs ? `?${qs}` : ''}`)
}
