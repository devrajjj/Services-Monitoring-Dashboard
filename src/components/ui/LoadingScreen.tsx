'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="h-8 w-8 text-blue-600 mx-auto" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading DemoCompany SRE Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Initializing monitoring systems...
        </p>
      </motion.div>
    </div>
  )
}
