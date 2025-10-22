'use client'

import { motion } from 'framer-motion'
import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-text-primary font-medium text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-text-secondary">
              {icon}
            </div>
          )}
          <textarea
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300 resize-none",
              icon ? "pl-10" : "",
              error ? "border border-red-500/50" : "glass",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            className="text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea


