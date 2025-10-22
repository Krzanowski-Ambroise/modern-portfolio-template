'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface IntersectionObserverProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  duration?: number
}

const IntersectionObserver = ({ 
  children, 
  className,
  threshold = 0.1,
  rootMargin = '0px',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6
}: IntersectionObserverProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    threshold,
    margin: rootMargin
  })

  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    },
    slideDown: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    }
  }

  const selectedAnimation = animations[animation]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedAnimation.initial}
      animate={isInView ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

export default IntersectionObserver


