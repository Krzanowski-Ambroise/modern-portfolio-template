'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
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

interface Technology {
  id: number
  name: string
  category: string
  created_at: string
}

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: Technology[]
  category: string
  github: string
  demo: string
  featured: boolean
  status: string
  year: string
  featured_position?: number
}

const ProjectsPreviewDynamic = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadProjects = useCallback(async () => {
    if (hasLoaded) {
      console.log('⏭️ Projects already loaded, skipping...')
      return
    }
    
    console.log('🔄 Loading projects...')
    try {
      const response = await fetch('/api/projects')
      console.log('📡 API Response status:', response.status)
      const data = await response.json()
      console.log('📦 Projects data:', data)
      setProjects(data.projects || [])
      setHasLoaded(true)
    } catch (error) {
      console.error('❌ Failed to load projects:', error)
    } finally {
      console.log('✅ Loading completed')
      setIsLoading(false)
    }
  }, [hasLoaded])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const featuredProjects = useMemo(() => {
    return projects.filter(project => project.featured).slice(0, 4)
  }, [projects])

  const getIconForCategory = (category: string) => {
    const icons: { [key: string]: any } = {
      'api': Shield,
      'monitoring': Network,
      'forensics': Lock,
      'network': Zap,
      'cloud': Cloud,
      'development': Code
    }
    return icons[category] || Code
  }

  const getColorForCategory = (category: string) => {
    const colors: { [key: string]: string } = {
      'api': 'from-primary-cyan to-primary-violet',
      'monitoring': 'from-primary-violet to-primary-pink',
      'forensics': 'from-primary-pink to-primary-cyan',
      'network': 'from-primary-cyan to-primary-violet',
      'cloud': 'from-primary-violet to-primary-pink',
      'development': 'from-primary-pink to-primary-cyan'
    }
    return colors[category] || 'from-primary-cyan to-primary-violet'
  }

  if (isLoading) {
    return (
      <section ref={ref} className="py-24 lg:py-32 relative">
        <div className="container-custom section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan mx-auto mb-4"></div>
            <p className="text-text-secondary">Chargement des projets...</p>
          </div>
        </div>
      </section>
    )
  }

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
          {featuredProjects.map((project, index) => {
            const IconComponent = getIconForCategory(project.category)
            const colorClass = getColorForCategory(project.category)
            
            return (
              <motion.div
                key={project.id}
                className="glass rounded-2xl overflow-hidden group hover:bg-primary-cyan/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-cyan/20 to-primary-violet/20 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-6 rounded-2xl bg-gradient-to-r ${colorClass}`}>
                      <IconComponent className="w-12 h-12 text-white" />
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
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/10 text-text-secondary text-sm rounded-full"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-white/10 text-text-secondary text-sm rounded-full">
                        +{project.technologies.length - 4}
                      </span>
                    )}
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
            )
          })}
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

export default ProjectsPreviewDynamic
