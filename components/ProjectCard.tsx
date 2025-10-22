'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Github, 
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle
} from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  icon: any
  color: string
  github: string
  demo: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'planned'
  year: string
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const statusConfig = {
    completed: { 
      label: 'Terminé', 
      icon: CheckCircle, 
      color: 'text-green-400' 
    },
    'in-progress': { 
      label: 'En cours', 
      icon: PlayCircle, 
      color: 'text-primary-cyan' 
    },
    planned: { 
      label: 'Planifié', 
      icon: Clock, 
      color: 'text-yellow-400' 
    }
  }

  const status = statusConfig[project.status]

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden group hover:bg-primary-cyan/10 transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-cyan/20 to-primary-violet/20 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`p-6 rounded-2xl bg-gradient-to-r ${project.color}`}
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <project.icon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center space-x-1 px-3 py-1 bg-black/50 rounded-full ${status.color}`}>
            <status.icon className="w-3 h-3" />
            <span className="text-xs font-medium">{status.label}</span>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-cyan/20 text-primary-cyan text-xs font-medium rounded-full">
              Projet phare
            </span>
          </div>
        )}

        {/* Year Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 px-3 py-1 bg-black/50 rounded-full text-white">
            <Calendar className="w-3 h-3" />
            <span className="text-xs font-medium">{project.year}</span>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-cyan transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-text-secondary mb-6 leading-relaxed text-sm">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <motion.span
              key={index}
              className="px-3 py-1 bg-white/10 text-text-secondary text-xs rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1 bg-white/10 text-text-secondary text-xs rounded-full">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <motion.a
            href={project.github}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-primary-cyan/20 transition-all duration-300 group"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium">Code</span>
          </motion.a>
          
          <motion.a
            href={project.demo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 btn-primary text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-medium">Démo</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard


