import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserPreferences } from '@nosh/shared'

export function usePreferences() {
  return useQuery<UserPreferences>({
    queryKey: ['preferences'],
    queryFn: () => api.get('/api/preferences'),
  })
}
