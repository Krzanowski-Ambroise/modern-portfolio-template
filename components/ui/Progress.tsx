'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

const Progress = ({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  color = 'primary'
}: ProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary-cyan to-primary-violet',
    secondary: 'bg-gradient-to-r from-primary-violet to-primary-pink',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    error: 'bg-gradient-to-r from-red-400 to-red-600'
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">Progression</span>
          <span className="text-text-primary font-medium">{value}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default Progress


