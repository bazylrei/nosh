import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchShoppingList, toggleShoppingCheck, uncheckAllShoppingItems } from '@/lib/shopping-list'
import type { ShoppingItem } from '@nosh/shared'

export function useShoppingList(weekStart: string) {
  return useQuery<ShoppingItem[]>({
    queryKey: ['shopping-list', weekStart],
    queryFn: () => fetchShoppingList(weekStart),
  })
}

export function useToggleShoppingCheck(weekStart: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ item, unit, checked }: { item: string; unit: string | null; checked: boolean }) =>
      toggleShoppingCheck(weekStart, item, unit, checked),
    onMutate: async ({ item, unit, checked }) => {
      await queryClient.cancelQueries({ queryKey: ['shopping-list', weekStart] })
      const prev = queryClient.getQueryData<ShoppingItem[]>(['shopping-list', weekStart])
      queryClient.setQueryData<ShoppingItem[]>(['shopping-list', weekStart], (old = []) =>
        old.map((i) => (i.item === item && i.unit === unit ? { ...i, checked } : i)),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['shopping-list', weekStart], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['shopping-list', weekStart] }),
  })
}

export function useUncheckAll(weekStart: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => uncheckAllShoppingItems(weekStart),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shopping-list', weekStart] }),
  })
}
