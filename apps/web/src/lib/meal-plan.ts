import { api } from './api'
import type { MealSlot, UpsertMealSlot } from '@nosh/shared'

export function fetchMealSlots(weekStart: string): Promise<MealSlot[]> {
  return api.get(`/api/meal-slots?weekStart=${weekStart}`)
}

export function upsertMealSlot(data: UpsertMealSlot): Promise<MealSlot> {
  return api.put('/api/meal-slots', data)
}

export function removeMealSlot(id: string): Promise<void> {
  return api.delete(`/api/meal-slots/${id}`)
}
