'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Github, 
  ExternalLink,
  Shield,
  Code,
  Lock,
  Network,
  Database,
  Cloud,
  Zap
} from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  github: string
  demo: string
  featured: boolean
  status: string
  year: string
  featured_position?: number
}

const ProjectsPreview = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const projects = [
    {
      title: 'SecureAuth API',
      description: 'API d\'authentification sécurisée avec JWT, 2FA et chiffrement AES-256. Architecture microservices avec rate limiting et monitoring avancé.',
      image: '/api/projects/secureauth.jpg',
      technologies: ['Node.js', 'JWT', '2FA', 'AES-256', 'Docker'],
      icon: Shield,
      color: 'from-primary-cyan to-primary-violet',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      title: 'CyberThreat Monitor',
      description: 'Dashboard de monitoring en temps réel avec détection d\'anomalies par IA. Intégration SIEM et alertes automatiques.',
      image: '/api/projects/monitor.jpg',
      technologies: ['React', 'Python', 'ML', 'ELK Stack', 'WebSocket'],
      icon: Network,
      color: 'from-primary-violet to-primary-pink',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      title: 'SecureVault',
      description: 'Gestionnaire de mots de passe sécurisé avec chiffrement end-to-end. Interface intuitive et synchronisation cloud.',
      image: '/api/projects/vault.jpg',
      technologies: ['React', 'AES-256', 'Cloud', 'PWA', 'Biometric'],
      icon: Lock,
      color: 'from-primary-pink to-primary-cyan',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'Network Security Scanner',
      description: 'Scanner de vulnérabilités réseau automatisé avec rapport détaillé. Intégration avec outils de sécurité existants.',
      image: '/api/projects/scanner.jpg',
      technologies: ['Python', 'Nmap', 'Nessus', 'API', 'Automation'],
      icon: Zap,
      color: 'from-primary-cyan to-primary-violet',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    }
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
            Projets <span className="gradient-text">réalisés</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-text-secondary max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Découvrez mes réalisations en cybersécurité, du développement d'APIs sécurisées 
            aux solutions de monitoring avancées.
          </motion.p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.filter(project => project.featured).map((project, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl overflow-hidden group hover:bg-primary-cyan/10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-cyan/20 to-primary-violet/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/30 to-primary-violet/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`p-6 rounded-2xl bg-gradient-to-r ${project.color}`}>
                    <project.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary-cyan/20 text-primary-cyan text-sm font-medium rounded-full">
                    Projet phare
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {project.title}
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 text-text-secondary text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-primary-cyan/20 transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 btn-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Démo</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {projects.filter(project => !project.featured).map((project, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-2xl group hover:bg-primary-cyan/10 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${project.color} flex-shrink-0`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-white/10 text-text-secondary text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <motion.a
                      href={project.github}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 glass rounded-lg hover:bg-primary-cyan/20 transition-all duration-300"
                    >
                      <Github className="w-4 h-4" />
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 glass rounded-lg hover:bg-primary-cyan/20 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/projets">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto group"
            >
              <span>Voir tous les projets</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsPreview
