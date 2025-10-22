'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BlurEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const BlurEffect = ({ 
  children, 
  className,
  intensity = 0.5,
  animate = true
}: BlurEffectProps) => {
  return (
    <motion.div
      className={className}
      style={{
        filter: `blur(${intensity}px)`
      }}
      animate={animate ? {
        filter: [
          `blur(${intensity}px)`,
          `blur(${intensity * 2}px)`,
          `blur(${intensity}px)`
        ]
      } : {}}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      } : {}}
    >
      {children}
    </motion.div>
  )
}

export default BlurEffect


