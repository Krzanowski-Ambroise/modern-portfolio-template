'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Shield, 
  Code, 
  Lock, 
  Network, 
  Award, 
  Target,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { number: '2+', label: 'Années de développement', icon: Award },
    { number: '15+', label: 'Projets réalisés', icon: Shield },
    { number: '100%', label: 'Motivation', icon: Target },
    { number: '24/7', label: 'Apprentissage', icon: Lock },
  ]

  const achievements = [
    'Formation en cybersécurité en alternance',
    'Background solide en développement web et mobile',
    'Spécialisation en sécurité applicative',
    'Connaissance des frameworks de sécurité (OWASP)',
    'Passion pour l\'apprentissage continu en cybersécurité',
  ]

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              À propos de <span className="gradient-text">mon parcours</span>
            </motion.h2>

            <motion.p 
              className="text-lg text-text-secondary mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Alternant en cybersécurité avec un solide background en développement, je me 
              spécialise dans la sécurité applicative et le développement sécurisé. Mon approche 
              combine compétences techniques et passion pour la cybersécurité.
            </motion.p>

            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-primary-cyan flex-shrink-0" />
                  <span className="text-text-secondary">{achievement}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              En savoir plus
            </motion.button>
          </motion.div>

          {/* Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass p-6 rounded-2xl text-center group hover:bg-primary-cyan/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-violet">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual Element */}
            <motion.div
              className="relative h-64 glass rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/20 via-primary-violet/20 to-primary-pink/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 border-4 border-primary-cyan/30 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 border-4 border-primary-violet/30 rounded-full flex items-center justify-center"
                  >
                    <Shield className="w-8 h-8 text-primary-cyan" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
