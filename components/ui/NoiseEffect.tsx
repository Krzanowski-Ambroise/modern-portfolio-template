'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface NoiseEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
  animate?: boolean
}

const NoiseEffect = ({ 
  children, 
  className,
  intensity = 0.1,
  animate = true
}: NoiseEffectProps) => {
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
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
        animate={animate ? {
          opacity: [0.1, 0.3, 0.1]
        } : {}}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
      />
    </motion.div>
  )
}

export default NoiseEffect



