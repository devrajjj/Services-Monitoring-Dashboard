'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const notificationVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const colorMap = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white'
}

export function Toaster() {
  const notifications = useAppStore(state => state.notifications)
  const removeNotification = useAppStore(state => state.removeNotification)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type]
          
          return (
            <motion.div
              key={notification.id}
              variants={notificationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 min-w-[320px] max-w-[400px]',
                'bg-white dark:bg-gray-800 border-l-4',
                notification.type === 'success' && 'border-l-green-500',
                notification.type === 'error' && 'border-l-red-500',
                notification.type === 'warning' && 'border-l-yellow-500',
                notification.type === 'info' && 'border-l-blue-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                'flex-shrink-0 p-1 rounded-full',
                colorMap[notification.type]
              )}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {notification.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {notification.message}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
