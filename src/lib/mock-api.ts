import { Service, ServiceEvent, CreateServiceRequest, UpdateServiceRequest, PaginatedResponse, ServiceListParams } from '@/types'
import { simulateNetworkDelay, simulateApiError, generateId } from './utils'

let services: Service[] = [
  {
    id: '1',
    name: 'User Authentication API',
    type: 'API',
    status: 'Online',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    description: 'Handles user authentication and authorization',
    endpoint: 'https://auth.DemoCompany.com',
    lastCheck: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Product Database',
    type: 'Database',
    status: 'Online',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:29:00Z',
    description: 'Primary product catalog database',
    endpoint: 'postgresql://products.DemoCompany.com',
    lastCheck: '2024-01-15T10:29:00Z'
  },
  {
    id: '3',
    name: 'Payment Gateway',
    type: 'Microservice',
    status: 'Degraded',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:25:00Z',
    description: 'Payment processing service',
    endpoint: 'https://payments.DemoCompany.com',
    lastCheck: '2024-01-15T10:25:00Z'
  },
  {
    id: '4',
    name: 'Redis Cache Cluster',
    type: 'Cache',
    status: 'Online',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:28:00Z',
    description: 'Distributed caching layer',
    endpoint: 'redis://cache.DemoCompany.com',
    lastCheck: '2024-01-15T10:28:00Z'
  },
  {
    id: '5',
    name: 'Monitoring Service',
    type: 'Monitoring',
    status: 'Offline',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
    description: 'System monitoring and alerting',
    endpoint: 'https://monitoring.DemoCompany.com',
    lastCheck: '2024-01-15T10:20:00Z'
  },
  {
    id: '6',
    name: 'Load Balancer',
    type: 'Infrastructure',
    status: 'Online',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:27:00Z',
    description: 'Traffic distribution and load balancing',
    endpoint: 'https://lb.DemoCompany.com',
    lastCheck: '2024-01-15T10:27:00Z'
  }
]

let events: ServiceEvent[] = [
  {
    id: '1',
    serviceId: '1',
    type: 'status_change',
    status: 'Online',
    message: 'Service came back online after maintenance',
    timestamp: '2024-01-15T10:30:00Z',
    severity: 'low'
  },
  {
    id: '2',
    serviceId: '3',
    type: 'status_change',
    status: 'Degraded',
    message: 'High latency detected in payment processing',
    timestamp: '2024-01-15T10:25:00Z',
    severity: 'medium'
  },
  {
    id: '3',
    serviceId: '5',
    type: 'status_change',
    status: 'Offline',
    message: 'Service went offline due to network issues',
    timestamp: '2024-01-15T10:20:00Z',
    severity: 'high'
  }
]

function filterServices(params: ServiceListParams): PaginatedResponse<Service> {
  let filteredServices = [...services]
  
  if (params.status) {
    filteredServices = filteredServices.filter(s => s.status === params.status)
  }
  
  if (params.type) {
    filteredServices = filteredServices.filter(s => s.type === params.type)
  }
  
  if (params.name_like) {
    filteredServices = filteredServices.filter(s => 
      s.name.toLowerCase().includes(params.name_like!.toLowerCase())
    )
  }
  
  const page = params.page || 1
  const limit = params.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedServices = filteredServices.slice(startIndex, endIndex)
  
  return {
    data: paginatedServices,
    pagination: {
      page,
      limit,
      total: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / limit)
    }
  }
}

function getServiceEvents(serviceId: string, page = 1, limit = 20): PaginatedResponse<ServiceEvent> {
  const serviceEvents = events.filter(e => e.serviceId === serviceId)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedEvents = serviceEvents.slice(startIndex, endIndex)
  
  return {
    data: paginatedEvents,
    pagination: {
      page,
      limit,
      total: serviceEvents.length,
      totalPages: Math.ceil(serviceEvents.length / limit)
    }
  }
}

export const mockApi = {
  async getServices(params: ServiceListParams = {}): Promise<PaginatedResponse<Service>> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to fetch services')
    }
    
    return filterServices(params)
  },
  
  async getService(id: string): Promise<Service> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to fetch service')
    }
    
    const service = services.find(s => s.id === id)
    if (!service) {
      throw new Error('Service not found')
    }
    
    return service
  },
  
  async createService(data: CreateServiceRequest): Promise<Service> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to create service')
    }
    
    const newService: Service = {
      id: generateId(),
      ...data,
      status: 'Online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastCheck: new Date().toISOString()
    }
    
    services.push(newService)
    return newService
  },
  
  async updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to update service')
    }
    
    const serviceIndex = services.findIndex(s => s.id === id)
    if (serviceIndex === -1) {
      throw new Error('Service not found')
    }
    
    const updatedService = {
      ...services[serviceIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    services[serviceIndex] = updatedService
    return updatedService
  },
  
  async deleteService(id: string): Promise<void> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to delete service')
    }
    
    const serviceIndex = services.findIndex(s => s.id === id)
    if (serviceIndex === -1) {
      throw new Error('Service not found')
    }
    
    services.splice(serviceIndex, 1)
    events = events.filter(e => e.serviceId !== id)
  },
  
  async getServiceEvents(serviceId: string, page = 1, limit = 20): Promise<PaginatedResponse<ServiceEvent>> {
    await simulateNetworkDelay()
    
    if (simulateApiError()) {
      throw new Error('Failed to fetch service events')
    }
    
    return getServiceEvents(serviceId, page, limit)
  },
  
    async pollServiceStatuses(): Promise<Service[]> {
    await simulateNetworkDelay(100, 300)
    
    services = services.map(service => {
      if (Math.random() < 0.1) {
        const statuses: Service['status'][] = ['Online', 'Offline', 'Degraded', 'Maintenance']
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        
        if (newStatus !== service.status) {
          const event: ServiceEvent = {
            id: generateId(),
            serviceId: service.id,
            type: 'status_change',
            status: newStatus,
            message: `Service status changed to ${newStatus}`,
            timestamp: new Date().toISOString(),
            severity: newStatus === 'Offline' ? 'high' : newStatus === 'Degraded' ? 'medium' : 'low'
          }
          events.push(event)
          
          return {
            ...service,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            lastCheck: new Date().toISOString()
          }
        }
      }
      return service
    })
    
    return services
  }
}
