'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface NeonTextProps {
  children: ReactNode
  className?: string
  color?: string
  intensity?: number
  animate?: boolean
}

const NeonText = ({ 
  children, 
  className,
  color = '#00D4FF',
  intensity = 0.5,
  animate = true
}: NeonTextProps) => {
  return (
    <motion.span
      className={className}
      style={{
        textShadow: `
          0 0 5px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')},
          0 0 10px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')},
          0 0 15px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')},
          0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}
        `,
        color: color
      }}
      animate={animate ? {
        textShadow: [
          `0 0 5px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 10px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 15px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 10px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 30px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 40px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 5px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 10px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 15px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}, 0 0 20px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`
        ]
      } : {}}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      } : {}}
    >
      {children}
    </motion.span>
  )
}

export default NeonText


