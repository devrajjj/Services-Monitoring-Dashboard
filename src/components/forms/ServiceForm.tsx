'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceType } from '@/types'
import { useCreateService, useUpdateService } from '@/hooks/useServices'

interface ServiceFormProps {
  service?: Service
  onClose: () => void
  onSuccess?: () => void
}

const serviceTypes: ServiceType[] = ['API', 'Database', 'Microservice', 'Infrastructure', 'Monitoring', 'Cache']

export const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'API' as ServiceType,
    description: '',
    endpoint: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const createService = useCreateService()
  const updateService = useUpdateService()

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        type: service.type,
        description: service.description || '',
        endpoint: service.endpoint || ''
      })
    }
  }, [service])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Service type is required'
    }

    if (formData.endpoint && !isValidUrl(formData.endpoint)) {
      newErrors.endpoint = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (service) {
        await updateService.mutateAsync({
          id: service.id,
          data: formData as UpdateServiceRequest
        })
      } else {
        await createService.mutateAsync(formData as CreateServiceRequest)
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to save service:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isLoading = createService.isPending || updateService.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.name 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Enter service name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Type *
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.type 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {serviceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter service description (optional)"
        />
      </div>

      <div>
        <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Endpoint URL
        </label>
        <input
          type="url"
          id="endpoint"
          value={formData.endpoint}
          onChange={(e) => handleInputChange('endpoint', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.endpoint 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="https://api.example.com"
        />
        {errors.endpoint && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endpoint}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
        >
          {service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  )
}
