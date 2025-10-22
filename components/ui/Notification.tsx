'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const Notification = ({ id, type, title, message, duration = 5000, onClose }: NotificationProps) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          onClose(id)
          return 0
        }
        return prev - (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-400'
      case 'error':
        return 'bg-red-400'
      case 'warning':
        return 'bg-yellow-400'
      default:
        return 'bg-blue-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative p-4 rounded-xl border backdrop-blur-sm ${getColors()} min-w-80 max-w-96`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-text-secondary mt-1">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
      
      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
        <motion.div
          className={`h-full ${getProgressColor()}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

export default Notification



