'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScanlineEffectProps {
  children: ReactNode
  className?: string
  speed?: number
  opacity?: number
}

const ScanlineEffect = ({ 
  children, 
  className,
  speed = 2,
  opacity = 0.1
}: ScanlineEffectProps) => {
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
            rgba(0, 212, 255, ${opacity}) 2px,
            rgba(0, 212, 255, ${opacity}) 4px
          )`
        }}
        animate={{
          y: ['-100%', '100%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </motion.div>
  )
}

export default ScanlineEffect



