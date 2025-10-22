'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, StarOff, X, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: number[]
  category: string
  github: string
  demo: string
  featured: boolean
  status: string
  year: string
  featured_position?: number
}

interface FeaturedProjectsManagerProps {
  projects: Project[]
  featuredProjects: Project[]
  onUpdateFeaturedProjects: (projectIds: number[]) => void
}

const FeaturedProjectsManager = ({ 
  projects, 
  featuredProjects, 
  onUpdateFeaturedProjects 
}: FeaturedProjectsManagerProps) => {
  const { addNotification } = useNotifications()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const moveProject = (projectId: number, direction: 'up' | 'down') => {
    const newFeatured = [...featuredProjects]
    const currentIndex = newFeatured.findIndex(p => p.id === projectId)
    
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex >= 0 && newIndex < newFeatured.length) {
      // Échanger les positions
      [newFeatured[currentIndex], newFeatured[newIndex]] = [newFeatured[newIndex], newFeatured[currentIndex]]
      onUpdateFeaturedProjects(newFeatured.map(p => p.id))
      
      const project = newFeatured[newIndex]
      addNotification({
        type: 'info',
        title: 'Ordre modifié',
        message: `"${project.title}" a été déplacé ${direction === 'up' ? 'vers le haut' : 'vers le bas'}.`
      })
    }
  }

  const removeFromFeatured = (projectId: number) => {
    console.log('Removing project from featured:', projectId)
    const project = featuredProjects.find(p => p.id === projectId)
    const newFeatured = featuredProjects.filter(p => p.id !== projectId)
    console.log('New featured projects:', newFeatured)
    onUpdateFeaturedProjects(newFeatured.map(p => p.id))
    
    if (project) {
      addNotification({
        type: 'info',
        title: 'Projet retiré des projets à la une',
        message: `"${project.title}" n'est plus en vedette.`
      })
    }
  }

  const addToFeatured = (project: Project) => {
    if (featuredProjects.length < 4) {
      const newFeatured = [...featuredProjects, project]
      onUpdateFeaturedProjects(newFeatured.map(p => p.id))
      
      addNotification({
        type: 'success',
        title: 'Projet ajouté aux projets à la une!',
        message: `"${project.title}" est maintenant en vedette.`
      })
    } else {
      addNotification({
        type: 'warning',
        title: 'Limite atteinte',
        message: 'Vous ne pouvez avoir que 4 projets à la une maximum.'
      })
    }
  }

  const availableProjects = projects.filter(p => 
    !featuredProjects.some(fp => fp.id === p.id)
  )

  return (
    <div className="space-y-6">
      {/* Projets à la une */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">
            Projets à la une (Maximum 4)
          </h3>
          <div className="text-sm text-text-secondary">
            {featuredProjects.length}/4 projets
          </div>
        </div>
        
        {featuredProjects.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="glass rounded-xl p-4 border border-white/10 hover:border-primary-cyan/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Numéro de position */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-cyan/20 text-primary-cyan font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      {/* Informations du projet */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary text-sm mb-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-primary-cyan font-medium">{project.category}</span>
                          <span className="text-xs text-text-secondary">{project.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex items-center space-x-2">
                      {/* Boutons de déplacement */}
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveProject(project.id, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded transition-colors ${
                            index === 0 
                              ? 'text-text-secondary/30 cursor-not-allowed' 
                              : 'text-text-secondary hover:text-primary-cyan hover:bg-primary-cyan/10'
                          }`}
                          title="Monter"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveProject(project.id, 'down')}
                          disabled={index === featuredProjects.length - 1}
                          className={`p-1 rounded transition-colors ${
                            index === featuredProjects.length - 1 
                              ? 'text-text-secondary/30 cursor-not-allowed' 
                              : 'text-text-secondary hover:text-primary-cyan hover:bg-primary-cyan/10'
                          }`}
                          title="Descendre"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Bouton de suppression */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Delete button clicked for project:', project.id)
                          removeFromFeatured(project.id)
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10 relative"
                        title="Retirer des projets à la une"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Star className="w-8 h-8 text-text-secondary" />
            </div>
            <h4 className="text-text-primary font-medium mb-2">Aucun projet à la une</h4>
            <p className="text-text-secondary text-sm">
              Ajoutez des projets depuis la liste ci-dessous
            </p>
          </div>
        )}
      </div>

      {/* Projets disponibles */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">
            Projets disponibles
          </h3>
          <div className="text-sm text-text-secondary">
            {availableProjects.length} projet(s) disponible(s)
          </div>
        </div>
        
        {availableProjects.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {availableProjects.map(project => (
                <motion.div
                  key={project.id}
                  className="glass rounded-xl p-4 border border-white/10 hover:border-primary-cyan/30 hover:bg-white/5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Icône de projet */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-text-secondary">
                        <StarOff className="w-4 h-4" />
                      </div>
                      
                      {/* Informations du projet */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary text-sm mb-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-primary-cyan font-medium">{project.category}</span>
                          <span className="text-xs text-text-secondary">{project.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bouton d'ajout */}
                    <button
                      onClick={() => addToFeatured(project)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition-colors"
                      title="Ajouter aux projets à la une"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Ajouter</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Star className="w-8 h-8 text-text-secondary" />
            </div>
            <h4 className="text-text-primary font-medium mb-2">Tous les projets sont à la une</h4>
            <p className="text-text-secondary text-sm">
              Tous vos projets sont déjà affichés sur la page d'accueil
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedProjectsManager
