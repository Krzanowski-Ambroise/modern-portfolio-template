'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-cyan to-primary-violet text-white hover:shadow-lg hover:shadow-primary-cyan/25 hover:scale-105",
    secondary: "glass text-text-primary hover:bg-white/20 hover:scale-105",
    outline: "border border-primary-cyan text-primary-cyan hover:bg-primary-cyan/10 hover:scale-105",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-white/10 hover:scale-105"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  )
}

export default Button


