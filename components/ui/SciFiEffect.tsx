'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SciFiEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const SciFiEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: SciFiEffectProps) => {
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
          background: `linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, ${intensity}) 50%, transparent 70%)`
        }}
        animate={animate ? {
          background: [
            `linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, ${intensity}) 50%, transparent 70%)`,
            `linear-gradient(45deg, transparent 30%, rgba(183, 148, 246, ${intensity}) 50%, transparent 70%)`,
            `linear-gradient(45deg, transparent 30%, rgba(240, 147, 251, ${intensity}) 50%, transparent 70%)`,
            `linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, ${intensity}) 50%, transparent 70%)`
          ]
        } : {}}
        transition={animate ? {
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        } : {}}
      />
    </motion.div>
  )
}

export default SciFiEffect



