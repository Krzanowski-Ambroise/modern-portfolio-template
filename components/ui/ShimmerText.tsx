'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ShimmerTextProps {
  children: ReactNode
  className?: string
  shimmerColor?: string
  duration?: number
}

const ShimmerText = ({ 
  children, 
  className,
  shimmerColor = '#00D4FF',
  duration = 2
}: ShimmerTextProps) => {
  return (
    <motion.span
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </motion.span>
  )
}

export default ShimmerText


