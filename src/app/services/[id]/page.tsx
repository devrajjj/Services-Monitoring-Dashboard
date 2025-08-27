'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useService, useServiceEvents, useDeleteService } from '@/hooks/useServices'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ServiceForm } from '@/components/forms/ServiceForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Activity,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ServiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: service, isLoading, error } = useService(serviceId)
  const { 
    data: eventsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useServiceEvents(serviceId)
  
  const deleteService = useDeleteService()

  const events = eventsData?.pages.flatMap(page => page.data) || []

  const handleDelete = async () => {
    try {
      await deleteService.mutateAsync(serviceId)
      router.push('/')
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Service Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The service you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/')} icon={<ArrowLeft size={16} />}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              icon={<ArrowLeft size={16} />}
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {service.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {service.description || 'No description provided'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={<Edit size={16} />}
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Service Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Status
              </h2>
              <StatusBadge status={service.status} size="lg" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Service Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{service.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Check</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.lastCheck ? formatDate(service.lastCheck) : 'Never'}
                </p>
              </div>
            </div>

            {service.endpoint && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Endpoint</p>
                <div className="flex items-center space-x-2">
                  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                    {service.endpoint}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ExternalLink size={14} />}
                    onClick={() => window.open(service.endpoint, '_blank')}
                  >
                    Open
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Events Timeline */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Activity className="mr-2" size={20} />
                Event Timeline
              </h2>
            </div>
            
            <div className="p-6">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No events yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Service events will appear here as they occur.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'high' ? 'bg-orange-500' :
                        event.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <StatusBadge status={event.status} size="sm" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white">{event.message}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {event.type.replace('_', ' ')} • {event.severity} severity
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {hasNextPage && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        loading={isFetchingNextPage}
                      >
                        Load More Events
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Info
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(service.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Updated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(service.updatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service ID</span>
                <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {service.id}
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Service"
        size="lg"
      >
        <ServiceForm
          service={service}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${service.name}"? This action cannot be undone.`}
        confirmText="Delete Service"
        loading={deleteService.isPending}
      />
    </div>
  )
}
