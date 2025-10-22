'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className 
}: BadgeProps) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-300"
  
  const variants = {
    default: "bg-white/10 text-text-secondary hover:bg-white/20",
    primary: "bg-gradient-to-r from-primary-cyan to-primary-violet text-white",
    secondary: "bg-primary-cyan/20 text-primary-cyan",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <motion.span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  )
}

export default Badge


