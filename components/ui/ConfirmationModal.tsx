'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import Portal from './Portal'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger'
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          border: 'border-red-500/20'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          border: 'border-yellow-500/20'
        }
      case 'info':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-blue-400" />,
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          border: 'border-blue-500/20'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center p-4" 
            style={{ 
              zIndex: 2147483647,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              isolation: 'isolate'
            }}
          >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            style={{ zIndex: 1 }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-background border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl ${styles.border}`}
            style={{ zIndex: 2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {styles.icon}
                <h3 className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="mb-6">
              <p className="text-text-secondary leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${styles.confirmButton}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </Portal>
  )
}

export default ConfirmationModal
