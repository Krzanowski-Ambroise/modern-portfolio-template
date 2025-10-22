'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: string
  animate?: boolean
}

const GradientText = ({ 
  children, 
  className,
  gradient = 'from-primary-cyan via-primary-violet to-primary-pink',
  animate = true
}: GradientTextProps) => {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      } : {}}
      transition={animate ? {
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
      style={animate ? {
        backgroundSize: '200% 200%'
      } : {}}
    >
      {children}
    </motion.span>
  )
}

export default GradientText


