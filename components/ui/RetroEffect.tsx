'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface RetroEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const RetroEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: RetroEffectProps) => {
  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 212, 255, ${intensity}) 2px,
            rgba(0, 212, 255, ${intensity}) 4px
          )`
        }}
        animate={animate ? {
          y: ['-100%', '100%']
        } : {}}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        } : {}}
      />
    </motion.div>
  )
}

export default RetroEffect



