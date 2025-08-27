import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { mockApi } from '@/lib/mock-api'
import { queryKeys, mutationKeys } from '@/lib/react-query'
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceListParams, PaginatedResponse, ServiceEvent } from '@/types'
import { useAppStore } from '@/store'

export function useServices(params: ServiceListParams = {}) {
  return useQuery({
    queryKey: queryKeys.services.list(params),
    queryFn: () => mockApi.getServices(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => mockApi.getService(id),
    enabled: !!id,
      staleTime: 2 * 60 * 1000,
  })
}

export function useServiceEvents(serviceId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: queryKeys.services.events(serviceId),
    queryFn: ({ pageParam }: { pageParam: number }) => mockApi.getServiceEvents(serviceId, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<ServiceEvent>) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    enabled: !!serviceId,
    staleTime: 1 * 60 * 1000,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  const addNotification = useAppStore(state => state.addNotification)
  
  return useMutation({
    mutationKey: mutationKeys.services.create(),
    mutationFn: (data: CreateServiceRequest) => mockApi.createService(data),
    onSuccess: (newService) => {
      queryClient.setQueryData(
        queryKeys.services.lists(),
        (old: { data: Service[]; pagination: { total: number; totalPages: number; page: number; limit: number } } | undefined) => {
          if (!old) return { data: [newService], pagination: { total: 1, totalPages: 1, page: 1, limit: 10 } }
          return {
            ...old,
            data: [newService, ...old.data],
            pagination: { ...old.pagination, total: old.pagination.total + 1 }
          }
        }
      )
      
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })
      
      addNotification({
        type: 'success',
        title: 'Service Created',
        message: `Successfully created service "${newService.name}"`
      })
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error instanceof Error ? error.message : 'Failed to create service'
      })
    }
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  const addNotification = useAppStore(state => state.addNotification)
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      mockApi.updateService(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.services.detail(id) })
      
      const previousService = queryClient.getQueryData(queryKeys.services.detail(id))
      
      queryClient.setQueryData(queryKeys.services.detail(id), (old: Service | undefined) => ({
        ...old!,
        ...data,
        updatedAt: new Date().toISOString()
      }))
      
      queryClient.setQueryData(
        queryKeys.services.lists(),
        (old: { data: Service[]; pagination: { total: number; totalPages: number; page: number; limit: number } } | undefined) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((service: Service) =>
              service.id === id ? { ...service, ...data, updatedAt: new Date().toISOString() } : service
            )
          }
        }
      )
      
      return { previousService }
    },
    onError: (err, { id }, context) => {

      if (context?.previousService) {
        queryClient.setQueryData(queryKeys.services.detail(id), context.previousService)
      }
      
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: err instanceof Error ? err.message : 'Failed to update service'
      })
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })
    },
    onSuccess: (updatedService) => {
      addNotification({
        type: 'success',
        title: 'Service Updated',
        message: `Successfully updated service "${updatedService.name}"`
      })
    }
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  const addNotification = useAppStore(state => state.addNotification)
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteService(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.services.lists() })
      
      const previousServices = queryClient.getQueryData(queryKeys.services.lists())
      
      queryClient.setQueryData(
        queryKeys.services.lists(),
        (old: { data: Service[]; pagination: { total: number; totalPages: number; page: number; limit: number } } | undefined) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.filter((service: Service) => service.id !== id),
            pagination: { ...old.pagination, total: old.pagination.total - 1 }
          }
        }
      )
      
      queryClient.removeQueries({ queryKey: queryKeys.services.detail(id) })
      
      return { previousServices }
    },
    onError: (err, id, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(queryKeys.services.lists(), context.previousServices)
      }
      
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: err instanceof Error ? err.message : 'Failed to delete service'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Service Deleted',
        message: 'Service has been successfully removed'
      })
    }
  })
}

export function useServiceStatusPolling(enabled = true) {
  return useQuery({
    queryKey: queryKeys.status.polling(),
    queryFn: () => mockApi.pollServiceStatuses(),
    enabled,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 1 * 60 * 1000,
  })
}
