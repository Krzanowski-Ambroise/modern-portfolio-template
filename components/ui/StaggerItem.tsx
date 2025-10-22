'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerItemProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  duration?: number
}

const StaggerItem = ({ 
  children, 
  className,
  animation = 'fadeIn',
  duration = 0.6
}: StaggerItemProps) => {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  }

  const selectedAnimation = animations[animation]

  return (
    <motion.div
      className={className}
      variants={selectedAnimation}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

export default StaggerItem


