import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMealSlots, upsertMealSlot, removeMealSlot } from '@/lib/meal-plan'
import type { MealSlot, UpsertMealSlot } from '@nosh/shared'

const slotsKey = (weekStart: string) => ['meal-slots', weekStart]

export function useMealSlots(weekStart: string) {
  return useQuery<MealSlot[]>({
    queryKey: slotsKey(weekStart),
    queryFn: () => fetchMealSlots(weekStart),
  })
}

export function useUpsertMealSlot(weekStart: string) {
  const queryClient = useQueryClient()
  return useMutation<MealSlot, Error, UpsertMealSlot>({
    mutationFn: upsertMealSlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: slotsKey(weekStart) }),
  })
}

export function useDeleteMealSlot(weekStart: string) {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: removeMealSlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: slotsKey(weekStart) }),
  })
}
