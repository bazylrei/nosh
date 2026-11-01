import { api } from './api'
import type { Recipe, MealType, Dietary, CreateRecipe, UpdateRecipe } from '@nosh/shared'

export function fetchRecipeById(id: string): Promise<Recipe> {
  return api.get(`/api/recipes/${id}`)
}

export function createRecipe(data: CreateRecipe): Promise<Recipe> {
  return api.post('/api/recipes', data)
}

export function updateRecipe(id: string, data: UpdateRecipe): Promise<Recipe> {
  return api.put(`/api/recipes/${id}`, data)
}

export function deleteRecipe(id: string): Promise<void> {
  return api.delete(`/api/recipes/${id}`)
}

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
