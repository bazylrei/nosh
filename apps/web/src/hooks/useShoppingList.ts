import { useQuery } from '@tanstack/react-query'
import { fetchShoppingList } from '@/lib/shopping-list'
import type { ShoppingItem } from '@nosh/shared'

export function useShoppingList(weekStart: string) {
  return useQuery<ShoppingItem[]>({
    queryKey: ['shopping-list', weekStart],
    queryFn: () => fetchShoppingList(weekStart),
  })
}
