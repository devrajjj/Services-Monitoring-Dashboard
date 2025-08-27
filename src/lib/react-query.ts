import { QueryClient } from '@tanstack/react-query'
import { ServiceListParams } from '@/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

export const queryKeys = {
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: ServiceListParams) => [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
    events: (id: string) => [...queryKeys.services.details(), id, 'events'] as const,
  },
  status: {
    all: ['status'] as const,
    polling: () => [...queryKeys.status.all, 'polling'] as const,
  }
}

export const mutationKeys = {
  services: {
    create: () => ['services', 'create'] as const,
    update: (id: string) => ['services', 'update', id] as const,
    delete: (id: string) => ['services', 'delete', id] as const,
  }
}
