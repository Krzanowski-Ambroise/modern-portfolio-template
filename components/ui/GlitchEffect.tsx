'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlitchEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const GlitchEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: GlitchEffectProps) => {
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
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.1) 50%, transparent 100%)',
          transform: 'translateX(-100%)'
        }}
        animate={animate ? {
          x: ['-100%', '100%']
        } : {}}
        transition={animate ? {
          duration: 0.5,
          repeat: Infinity,
          ease: 'linear'
        } : {}}
      />
    </motion.div>
  )
}

export default GlitchEffect



