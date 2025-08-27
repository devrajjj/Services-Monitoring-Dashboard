import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ServiceStatus } from '@/types'
import { CheckCircle, XCircle, AlertTriangle, Clock, HelpCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: ServiceStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  animated?: boolean
  className?: string
}

const statusConfig = {
  Online: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    pulse: true
  },
  Offline: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    iconColor: 'text-red-600',
    pulse: false
  },
  Degraded: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    pulse: true
  },
  Maintenance: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock,
    iconColor: 'text-blue-600',
    pulse: false
  },
  Unknown: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: HelpCircle,
    iconColor: 'text-gray-600',
    pulse: false
  }
}

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  animated = true,
  className
}) => {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium transition-colors',
        config.color,
        sizeConfig[size],
        className
      )}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.2 }}
      whileHover={animated ? { scale: 1.05 } : undefined}
    >
      {showIcon && (
        <div
          className={cn('flex-shrink-0', config.iconColor)}
        >
          <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
        </div>
      )}
      
      <span className="font-semibold">{status}</span>
      
    </motion.div>
  )
}

export const StatusPulse: React.FC<{ status: ServiceStatus }> = () => {
  return null
}
