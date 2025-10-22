'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface HologramEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const HologramEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: HologramEffectProps) => {
  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
      animate={animate ? {
        background: [
          'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.1) 50%, transparent 70%)',
          'linear-gradient(45deg, transparent 30%, rgba(183, 148, 246, 0.1) 50%, transparent 70%)',
          'linear-gradient(45deg, transparent 30%, rgba(240, 147, 251, 0.1) 50%, transparent 70%)',
          'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.1) 50%, transparent 70%)'
        ]
      } : {}}
      transition={animate ? {
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
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
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        } : {}}
      />
    </motion.div>
  )
}

export default HologramEffect



