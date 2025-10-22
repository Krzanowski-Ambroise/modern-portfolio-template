'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  glitchChars?: string
  glitchDuration?: number
  glitchInterval?: number
}

const GlitchText = ({ 
  text, 
  className,
  glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?',
  glitchDuration = 100,
  glitchInterval = 2000
}: GlitchTextProps) => {
  const [glitchedText, setGlitchedText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      
      // Generate glitched text
      const glitched = text.split('').map((char, index) => {
        if (Math.random() < 0.3) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      }).join('')
      
      setGlitchedText(glitched)
      
      setTimeout(() => {
        setGlitchedText(text)
        setIsGlitching(false)
      }, glitchDuration)
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [text, glitchChars, glitchDuration, glitchInterval])

  return (
    <motion.span
      className={className}
      animate={isGlitching ? { 
        x: [0, -2, 2, -1, 1, 0],
        y: [0, -1, 1, 0],
        color: ['#00D4FF', '#B794F6', '#F093FB', '#00D4FF']
      } : {}}
      transition={{ duration: 0.1 }}
    >
      {glitchedText}
    </motion.span>
  )
}

export default GlitchText