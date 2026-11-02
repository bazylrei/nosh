import { api } from './api'
import type { ShoppingItem } from '@nosh/shared'

export function fetchShoppingList(weekStart: string): Promise<ShoppingItem[]> {
  return api.get(`/api/shopping-list?weekStart=${weekStart}`)
}

export function toggleShoppingCheck(weekStart: string, item: string, unit: string | null, checked: boolean): Promise<void> {
  return api.patch('/api/shopping-list/checked', { weekStart, item, unit, checked })
}

export function uncheckAllShoppingItems(weekStart: string): Promise<void> {
  return api.delete(`/api/shopping-list/checked?weekStart=${weekStart}`)
}
