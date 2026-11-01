import { api } from './api'
import type { ShoppingItem } from '@nosh/shared'

export function fetchShoppingList(weekStart: string): Promise<ShoppingItem[]> {
  return api.get(`/api/shopping-list?weekStart=${weekStart}`)
}
