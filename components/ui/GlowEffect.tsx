'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowEffectProps {
  children: ReactNode
  className?: string
  color?: string
  intensity?: number
  animate?: boolean
}

const GlowEffect = ({ 
  children, 
  className,
  color = '#00D4FF',
  intensity = 0.3,
  animate = true
}: GlowEffectProps) => {
  return (
    <motion.div
      className={className}
      style={{
        boxShadow: `
          0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')},
          0 0 40px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')},
          0 0 60px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}
        `
      }}
      animate={animate ? {
        boxShadow: [
          `0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 40px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 60px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 30px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 60px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 90px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 40px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 60px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`
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

export default GlowEffect


