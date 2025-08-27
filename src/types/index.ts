export interface Service {
  id: string
  name: string
  type: ServiceType
  status: ServiceStatus
  createdAt: string
  updatedAt: string
  description?: string
  endpoint?: string
  lastCheck?: string
}

export type ServiceType = 'API' | 'Database' | 'Microservice' | 'Infrastructure' | 'Monitoring' | 'Cache'

export type ServiceStatus = 'Online' | 'Offline' | 'Degraded' | 'Maintenance' | 'Unknown'

export interface ServiceEvent {
  id: string
  serviceId: string
  type: 'status_change' | 'maintenance' | 'incident' | 'deployment'
  status: ServiceStatus
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  metadata?: Record<string, string | number | boolean>
}

export interface CreateServiceRequest {
  name: string
  type: ServiceType
  description?: string
  endpoint?: string
}

export interface UpdateServiceRequest {
  name?: string
  type?: ServiceType
  description?: string
  endpoint?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ServiceFilters {
  status?: ServiceStatus
  type?: ServiceType
  name_like?: string
}

export interface ServiceListParams extends ServiceFilters {
  page?: number
  limit?: number
}

export interface Theme {
  mode: 'light' | 'dark'
  primary: string
  secondary: string
  accent: string
}

export interface AppState {
  theme: Theme
  sidebarOpen: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}
