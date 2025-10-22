'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FuturisticEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const FuturisticEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: FuturisticEffectProps) => {
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
          background: `linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, ${intensity}) 50%, transparent 100%)`
        }}
        animate={animate ? {
          x: ['-100%', '100%']
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

export default FuturisticEffect



