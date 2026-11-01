import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserPreferences } from '@nosh/shared'

export function usePreferences() {
  return useQuery<UserPreferences>({
    queryKey: ['preferences'],
    queryFn: () => api.get('/api/preferences'),
  })
}

export function useSavePreferences() {
  const queryClient = useQueryClient()
  return useMutation<UserPreferences, Error, UserPreferences>({
    mutationFn: (data) => api.put('/api/preferences', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['preferences'], data)
    },
  })
}
