'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Shield, 
  Code, 
  Lock, 
  Network, 
  Cloud,
  Database,
  Terminal,
  Eye,
  Zap,
  Globe
} from 'lucide-react'

const SkillsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const skillCategories = [
    {
      title: 'Développement Web',
      icon: Code,
      color: 'from-primary-cyan to-primary-violet',
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'TypeScript', level: 75 },
      ],
      description: 'Développement web moderne et sécurisé'
    },
    {
      title: 'Sécurité Applicative',
      icon: Shield,
      color: 'from-primary-violet to-primary-pink',
      skills: [
        { name: 'OWASP Top 10', level: 85 },
        { name: 'Penetration Testing', level: 70 },
        { name: 'Code Review', level: 80 },
        { name: 'Vulnerability Assessment', level: 75 },
      ],
      description: 'Sécurité des applications web'
    },
    {
      title: 'Outils de Sécurité',
      icon: Lock,
      color: 'from-primary-pink to-primary-cyan',
      skills: [
        { name: 'Burp Suite', level: 70 },
        { name: 'OWASP ZAP', level: 75 },
        { name: 'Nmap', level: 80 },
        { name: 'Wireshark', level: 65 },
      ],
      description: 'Outils d\'analyse et de test de sécurité'
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      color: 'from-primary-cyan to-primary-pink',
      skills: [
        { name: 'Docker', level: 80 },
        { name: 'AWS', level: 70 },
        { name: 'Git', level: 90 },
        { name: 'CI/CD', level: 75 },
      ],
      description: 'Déploiement sécurisé et automatisation'
    },
    {
      title: 'Cryptographie',
      icon: Lock,
      color: 'from-primary-violet to-primary-cyan',
      skills: [
        { name: 'HTTPS/TLS', level: 85 },
        { name: 'JWT', level: 80 },
        { name: 'Hashing', level: 90 },
        { name: 'Encryption', level: 75 },
      ],
      description: 'Chiffrement et authentification'
    },
    {
      title: 'Formation Continue',
      icon: Zap,
      color: 'from-primary-pink to-primary-violet',
      skills: [
        { name: 'Cybersécurité', level: 85 },
        { name: 'Ethical Hacking', level: 70 },
        { name: 'Incident Response', level: 65 },
        { name: 'Security Awareness', level: 80 },
      ],
      description: 'Apprentissage continu en cybersécurité'
    },
  ]

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="container-custom section-padding">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Mes <span className="gradient-text">compétences</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-text-secondary max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Compétences techniques en développement et cybersécurité, 
            avec une approche pratique et une formation continue en alternance.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="glass p-6 rounded-2xl hover:bg-primary-cyan/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Category Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {category.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary font-medium">
                        {skill.name}
                      </span>
                      <span className="text-primary-cyan font-bold">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: 1 + categoryIndex * 0.1 + skillIndex * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4"
          >
            Voir tous mes projets
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
