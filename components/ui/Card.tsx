'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

const Card = ({ children, className, hover = true, glass = true }: CardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-2xl transition-all duration-300",
        glass && "glass",
        hover && "hover:bg-primary-cyan/10 hover:-translate-y-1",
        className
      )}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  )
}

export default Card


