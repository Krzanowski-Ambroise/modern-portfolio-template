'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  Save,
  X,
  Search
} from 'lucide-react'
import FeaturedProjectsManager from './FeaturedProjectsManager'
import ConfirmationModal from '../ui/ConfirmationModal'
import Portal from '../ui/Portal'
import AdvancedDashboard from './AdvancedDashboard'
import ProfileManager from './ProfileManager'
import DocumentManager from './DocumentManager'
import { useNotifications } from '@/contexts/NotificationContext'

interface Technology {
  id: number
  name: string
  category: string
  created_at: string
}

interface Category {
  id: number
  name: string
  description: string
  created_at: string
}

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: number[]  // IDs des technologies
  category: string
  github: string
  demo: string
  featured: boolean
  status: string
  year: string
  featured_position?: number
}

interface AdminContentProps {
  activeSection: string
  projects: Project[]
  categories: Category[]
  technologies: Technology[]
  featuredProjects: Project[]
  onLoadProjects: () => void
  onLoadCategories: () => void
  onLoadTechnologies: () => void
  onUpdateFeaturedProjects: (projectIds: number[]) => void
}

const AdminContent = ({
  activeSection,
  projects,
  categories,
  technologies,
  featuredProjects,
  onLoadProjects,
  onLoadCategories,
  onLoadTechnologies,
  onUpdateFeaturedProjects
}: AdminContentProps) => {
  const { addNotification } = useNotifications()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showTechnologyForm, setShowTechnologyForm] = useState(false)
  const [techSearchQuery, setTechSearchQuery] = useState('')
  const [techSuggestions, setTechSuggestions] = useState<any[]>([])
  const [showTechSuggestions, setShowTechSuggestions] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })
  
  // États pour la recherche et pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(6)

  // Désactiver le scroll quand un popup est ouvert
  useEffect(() => {
    if (showProjectForm || showCategoryForm || showTechnologyForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function pour remettre le scroll quand le composant se démonte
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showProjectForm, showCategoryForm, showTechnologyForm])

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false)
      }
      if (!target.closest('.status-dropdown')) {
        setShowStatusDropdown(false)
      }
    }

    if (showCategoryDropdown || showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategoryDropdown, showStatusDropdown])

  // Reset form when closing
  useEffect(() => {
    if (!showProjectForm) {
      setNewProject({
        title: '',
        description: '',
        image: '',
        technologies: [],
        category_id: 0,
        github: '',
        demo: '',
        featured: false,
        status: 'completed',
        year: new Date().getFullYear().toString(),
      })
      setEditingProject(null)
      setTechSearchQuery('')
      setTechSuggestions([])
      setShowTechSuggestions(false)
      setShowCategoryDropdown(false)
      setShowStatusDropdown(false)
    }
  }, [showProjectForm])

  // Fonction utilitaire pour afficher la popup de confirmation
  const showConfirmation = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'danger') => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    })
  }

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }))
  }

  // Fonctions de filtrage et pagination
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === null || project.category_id === selectedCategory
    const matchesYear = selectedYear === null || project.year === selectedYear
    
    return matchesSearch && matchesCategory && matchesYear
  })

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedYear(null)
    setCurrentPage(1)
  }

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedYear])

  // Fonction utilitaire pour récupérer le token
  const getAuthToken = () => {
    // Essayer adminToken d'abord (nom utilisé dans l'admin)
    let token = localStorage.getItem('adminToken')
    if (token) return token

    // Essayer token (nom générique)
    token = localStorage.getItem('token')
    if (token) return token

    // Essayer sessionStorage
    token = sessionStorage.getItem('adminToken')
    if (token) return token

    token = sessionStorage.getItem('token')
    if (token) return token

    // Essayer les cookies
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('adminToken='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }

    const tokenCookie2 = cookies.find(cookie => cookie.trim().startsWith('token='))
    if (tokenCookie2) {
      return tokenCookie2.split('=')[1]
    }

    return null
  }

  // Fonction pour rechercher des technologies
  const searchTechnologies = (query: string) => {
    if (query.length < 2) {
      setTechSuggestions([])
      setShowTechSuggestions(false)
      return
    }

    const filtered = technologies
      .filter(tech => 
        !newProject.technologies.includes(tech.id) &&
        tech.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
    
    setTechSuggestions(filtered)
    setShowTechSuggestions(true)
  }

  // Fonction pour ajouter une technologie existante
  const addExistingTechnology = (techId: number) => {
    if (!newProject.technologies.includes(techId)) {
      setNewProject({ 
        ...newProject, 
        technologies: [...newProject.technologies, techId] 
      })
    }
    setTechSearchQuery('')
    setShowTechSuggestions(false)
  }

  // Fonction pour créer et ajouter une nouvelle technologie
  const createAndAddTechnology = async (techName: string) => {
    try {
      const token = getAuthToken()
      
      console.log('Token found:', token ? 'Yes' : 'No')
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'None')
      
      if (!token) {
        alert('Token d\'authentification manquant. Veuillez vous reconnecter.')
        return
      }

      console.log('Creating technology:', techName)
      
      const response = await fetch('/api/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: techName, category: 'Autre' })
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Created technology:', data)
        const newTech = data.technology
        
        // Ajouter la nouvelle technologie au projet
        setNewProject({ 
          ...newProject, 
          technologies: [...newProject.technologies, newTech.id] 
        })
        
        // Recharger la liste des technologies
        onLoadTechnologies()
        
        setTechSearchQuery('')
        setShowTechSuggestions(false)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        console.error('Response status:', response.status)
        alert(`Erreur lors de la création de la technologie: ${errorData.error || 'Erreur inconnue'}`)
      }
    } catch (error) {
      console.error('Error creating technology:', error)
      alert('Erreur lors de la création de la technologie')
    }
  }

  // Gérer la soumission de la recherche
  const handleTechSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const query = techSearchQuery.trim()
      
      if (query.length < 2) return

      // Chercher si une technologie existe déjà
      const existingTech = technologies.find(tech => 
        tech.name.toLowerCase() === query.toLowerCase()
      )

      if (existingTech && !newProject.technologies.includes(existingTech.id)) {
        addExistingTechnology(existingTech.id)
      } else if (!existingTech) {
        // Créer une nouvelle technologie
        createAndAddTechnology(query)
      }
    }
  }
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [] as number[],
    category_id: 0,
    github: '',
    demo: '',
    featured: false,
    status: 'completed',
    year: new Date().getFullYear().toString()
  })
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  })
  
  const [newTechnology, setNewTechnology] = useState({
    name: '',
    category: 'Autre'
  })

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    const token = getAuthToken()
    if (!token) {
      alert('Vous devez être connecté pour modifier un projet')
      return
    }

    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Projet mis à jour avec succès!',
          message: `Le projet "${newProject.title}" a été modifié.`
        })
        setShowProjectForm(false)
        setEditingProject(null)
        onLoadProjects()
      } else {
        const errorData = await response.json()
        addNotification({
          type: 'error',
          title: 'Erreur lors de la mise à jour',
          message: `Impossible de modifier le projet: ${errorData.error || 'Erreur inconnue'}`
        })
      }
    } catch (error) {
      console.error('Update project failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la mise à jour',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      })
      
      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Projet créé avec succès!',
          message: `Le projet "${newProject.title}" a été ajouté.`
        })
        setNewProject({
          title: '',
          description: '',
          image: '',
          technologies: [],
          category_id: 0,
          github: '',
          demo: '',
          featured: false,
          status: 'completed',
          year: new Date().getFullYear().toString()
        })
        setShowProjectForm(false)
        onLoadProjects()
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la création',
          message: 'Impossible de créer le projet.'
        })
      }
    } catch (error) {
      console.error('Create project failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la création',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      })
      
      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Catégorie créée avec succès!',
          message: `La catégorie "${newCategory.name}" a été ajoutée.`
        })
        setNewCategory({ name: '', description: '' })
        setShowCategoryForm(false)
        onLoadCategories()
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la création',
          message: 'Impossible de créer la catégorie.'
        })
      }
    } catch (error) {
      console.error('Create category failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la création',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleCreateTechnology = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTechnology)
      })
      
      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Technologie créée avec succès!',
          message: `La technologie "${newTechnology.name}" a été ajoutée.`
        })
        setNewTechnology({ name: '', category: 'Autre' })
        setShowTechnologyForm(false)
        onLoadTechnologies()
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la création',
          message: 'Impossible de créer la technologie.'
        })
      }
    } catch (error) {
      console.error('Create technology failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la création',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      category_id: project.category_id,
      github: project.github,
      demo: project.demo,
      featured: project.featured,
      status: project.status,
      year: project.year,
    })
    setShowProjectForm(true)
  }

  const handleDeleteProject = async (id: number) => {
    const project = projects.find(p => p.id === id)
    const projectName = project?.title || 'ce projet'
    
    showConfirmation(
      'Supprimer le projet',
      `Êtes-vous sûr de vouloir supprimer "${projectName}" ? Cette action est irréversible.`,
      async () => {
        try {
          const token = localStorage.getItem('adminToken')
          const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (response.ok) {
            addNotification({
              type: 'success',
              title: 'Projet supprimé avec succès!',
              message: `Le projet "${projectName}" a été supprimé.`
            })
            onLoadProjects()
          } else {
            addNotification({
              type: 'error',
              title: 'Erreur lors de la suppression',
              message: 'Impossible de supprimer le projet.'
            })
          }
        } catch (error) {
          console.error('Delete project failed:', error)
          addNotification({
            type: 'error',
            title: 'Erreur lors de la suppression',
            message: 'Une erreur inattendue s\'est produite.'
          })
        }
      },
      'danger'
    )
  }

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find(c => c.id === id)
    const categoryName = category?.name || 'cette catégorie'
    
    showConfirmation(
      'Supprimer la catégorie',
      `Êtes-vous sûr de vouloir supprimer "${categoryName}" ? Tous les projets associés perdront leur catégorie.`,
      async () => {
        try {
          const token = localStorage.getItem('adminToken')
          const response = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (response.ok) {
            addNotification({
              type: 'success',
              title: 'Catégorie supprimée avec succès!',
              message: `La catégorie "${categoryName}" a été supprimée.`
            })
            onLoadCategories()
          } else {
            addNotification({
              type: 'error',
              title: 'Erreur lors de la suppression',
              message: 'Impossible de supprimer la catégorie.'
            })
          }
        } catch (error) {
          console.error('Delete category failed:', error)
          addNotification({
            type: 'error',
            title: 'Erreur lors de la suppression',
            message: 'Une erreur inattendue s\'est produite.'
          })
        }
      },
      'warning'
    )
  }

  const handleDeleteTechnology = async (id: number) => {
    const technology = technologies.find(t => t.id === id)
    const techName = technology?.name || 'cette technologie'
    
    showConfirmation(
      'Supprimer la technologie',
      `Êtes-vous sûr de vouloir supprimer "${techName}" ? Elle sera retirée de tous les projets qui l'utilisent.`,
      async () => {
        try {
          const token = localStorage.getItem('adminToken')
          const response = await fetch(`/api/technologies/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (response.ok) {
            addNotification({
              type: 'success',
              title: 'Technologie supprimée avec succès!',
              message: `La technologie "${techName}" a été supprimée.`
            })
            onLoadTechnologies()
          } else {
            addNotification({
              type: 'error',
              title: 'Erreur lors de la suppression',
              message: 'Impossible de supprimer la technologie.'
            })
          }
        } catch (error) {
          console.error('Delete technology failed:', error)
          addNotification({
            type: 'error',
            title: 'Erreur lors de la suppression',
            message: 'Une erreur inattendue s\'est produite.'
          })
        }
      },
      'warning'
    )
  }

  return (
    <div className="flex-1 p-6 pt-24">
          {activeSection === 'dashboard' && (
            <AdvancedDashboard />
          )}

          {activeSection === 'profile' && (
            <ProfileManager />
          )}

          {activeSection === 'documents' && (
            <DocumentManager />
          )}

      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">Gestion des Projets</h2>
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="flex items-center space-x-2 px-4 py-2 btn-primary hover:bg-primary-cyan/20 transition-all duration-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un projet</span>
            </button>
          </div>

          {showProjectForm && (
            <Portal>
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 mt-16"
                style={{ 
                  zIndex: 2147483647,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  isolation: 'isolate'
                }}
                onClick={() => setShowProjectForm(false)}
              >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-text-primary">
                        {editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
                      </h3>
                      <button
                        onClick={() => setShowProjectForm(false)}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                
                <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-6">
                  {/* Titre et Année */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Titre du projet <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                        placeholder="Ex: SecureAuth API"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Année <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={newProject.year}
                        onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                        placeholder="2024"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300 h-28 resize-none"
                      placeholder="Décrivez votre projet en détail..."
                      required
                    />
                  </div>

                  {/* Image et Catégorie */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newProject.image}
                        onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-text-primary">
                            Catégorie <span className="text-red-400">*</span>
                          </label>
                          
                          {/* Sélecteur de catégorie personnalisé */}
                          <div className="relative category-dropdown">
                            <button
                              type="button"
                              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300 text-left flex items-center justify-between"
                            >
                              <span className={newProject.category_id === 0 ? 'text-text-secondary/60' : 'text-text-primary'}>
                                {newProject.category_id === 0 
                                  ? 'Sélectionner une catégorie' 
                                  : categories.find(cat => cat.id === newProject.category_id)?.name || 'Catégorie inconnue'
                                }
                              </span>
                              <svg 
                                className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Dropdown des catégories */}
                            {showCategoryDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-background border border-white/20 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {categories.map((category) => (
                                  <button
                                    key={`category-${category.id}`}
                                    type="button"
                                    onClick={() => {
                                      setNewProject({ ...newProject, category_id: category.id })
                                      setShowCategoryDropdown(false)
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center justify-between ${
                                      newProject.category_id === category.id ? 'bg-primary-cyan/20 text-primary-cyan' : 'text-text-primary'
                                    }`}
                                  >
                                    <div>
                                      <span className="font-medium">{category.name}</span>
                                      {category.description && (
                                        <span className="text-text-secondary text-sm ml-2">({category.description})</span>
                                      )}
                                    </div>
                                    {newProject.category_id === category.id && (
                                      <svg className="w-4 h-4 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                  </div>

                  {/* GitHub et Démo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={newProject.github}
                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Démo
                      </label>
                      <input
                        type="url"
                        value={newProject.demo}
                        onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                        placeholder="https://demo.com"
                      />
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-text-primary">
                      Technologies utilisées
                    </label>
                    
                    {/* Technologies sélectionnées */}
                    {newProject.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {newProject.technologies.map((techId, index) => {
                          const tech = technologies.find(t => t.id === techId)
                          return tech ? (
                            <span
                              key={`selected-tech-${techId}-${index}`}
                              className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-cyan/20 text-primary-cyan rounded-full text-sm font-medium"
                            >
                              <span>{tech.name}</span>
                              <button
                                type="button"
                                onClick={() => setNewProject({ 
                                  ...newProject, 
                                  technologies: newProject.technologies.filter(id => id !== techId) 
                                })}
                                className="ml-1 hover:text-primary-cyan/70 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : null
                        })}
                      </div>
                    )}

                    {/* Barre de recherche intelligente */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={techSearchQuery}
                          onChange={(e) => {
                            setTechSearchQuery(e.target.value)
                            searchTechnologies(e.target.value)
                          }}
                          onKeyDown={handleTechSearchSubmit}
                          onFocus={() => {
                            if (techSearchQuery.length >= 2) {
                              setShowTechSuggestions(true)
                            }
                          }}
                          onBlur={() => {
                            // Délai pour permettre le clic sur les suggestions
                            setTimeout(() => setShowTechSuggestions(false), 200)
                          }}
                          className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                          placeholder="Rechercher ou ajouter une technologie..."
                        />
                        {/* Icône de recherche */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Suggestions dropdown */}
                      {showTechSuggestions && techSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-white/20 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {techSuggestions.map((tech, index) => (
                            <button
                              key={`suggestion-${tech.id}-${index}`}
                              type="button"
                              onClick={() => addExistingTechnology(tech.id)}
                              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center justify-between"
                            >
                              <div>
                                <span className="text-text-primary font-medium">{tech.name}</span>
                                <span className="text-text-secondary text-sm ml-2">({tech.category})</span>
                              </div>
                              <svg className="w-4 h-4 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message pour créer une nouvelle technologie */}
                      {showTechSuggestions && techSuggestions.length === 0 && techSearchQuery.length >= 2 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-white/20 rounded-xl shadow-lg">
                          <button
                            type="button"
                            onClick={() => createAndAddTechnology(techSearchQuery)}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-text-primary font-medium">Créer "{techSearchQuery}"</span>
                              <span className="text-text-secondary text-sm ml-2">(Nouvelle technologie)</span>
                            </div>
                            <svg className="w-4 h-4 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Technologies disponibles */}
                    {technologies.filter(tech => !newProject.technologies.includes(tech.id)).length > 0 && (
                      <div className="text-xs text-text-secondary">
                        {technologies.filter(tech => !newProject.technologies.includes(tech.id)).length} technologie(s) disponible(s)
                      </div>
                    )}
                  </div>

                  {/* État du projet */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary">
                      État du projet <span className="text-red-400">*</span>
                    </label>
                    
                    {/* Sélecteur d'état personnalisé */}
                    <div className="relative status-dropdown">
                      <button
                        type="button"
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300 text-left flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          {newProject.status === 'completed' && (
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {newProject.status === 'in_progress' && (
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                          <span className={newProject.status === '' ? 'text-text-secondary/60' : 'text-text-primary'}>
                            {newProject.status === 'completed' ? 'Terminé' : 
                             newProject.status === 'in_progress' ? 'En cours' : 
                             'Sélectionner un état'}
                          </span>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown des états */}
                      {showStatusDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-white/20 rounded-xl shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setNewProject({ ...newProject, status: 'completed' })
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center justify-between ${
                              newProject.status === 'completed' ? 'bg-primary-cyan/20 text-primary-cyan' : 'text-text-primary'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <div>
                                <span className="font-medium">Terminé</span>
                                <p className="text-sm text-text-secondary">Projet finalisé et fonctionnel</p>
                              </div>
                            </div>
                            {newProject.status === 'completed' && (
                              <svg className="w-4 h-4 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setNewProject({ ...newProject, status: 'in_progress' })
                              setShowStatusDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center justify-between ${
                              newProject.status === 'in_progress' ? 'bg-primary-cyan/20 text-primary-cyan' : 'text-text-primary'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <div>
                                <span className="font-medium">En cours</span>
                                <p className="text-sm text-text-secondary">Projet en développement actif</p>
                              </div>
                            </div>
                            {newProject.status === 'in_progress' && (
                              <svg className="w-4 h-4 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Projet à la une */}
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-cyan focus:ring-primary-cyan/50 focus:ring-2"
                    />
                    <div>
                      <span className="text-text-primary font-medium">Projet à la une</span>
                      <p className="text-sm text-text-secondary">Afficher ce projet sur la page d'accueil</p>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-violet text-white rounded-xl font-semibold hover:from-primary-cyan/90 hover:to-primary-violet/90 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          <Save className="w-5 h-5" />
                          <span>{editingProject ? 'Modifier le projet' : 'Créer le projet'}</span>
                        </button>
                    <button
                      type="button"
                      onClick={() => setShowProjectForm(false)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 text-text-primary rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      <span>Annuler</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
            </Portal>
          )}

          <FeaturedProjectsManager
            projects={projects}
            featuredProjects={featuredProjects}
            onUpdateFeaturedProjects={onUpdateFeaturedProjects}
          />

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Tous les projets</h3>
              <div className="text-sm text-text-secondary">
                {filteredProjects.length} projet(s) trouvé(s)
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="mb-6 space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un projet..."
                  className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap gap-4">
                {/* Filtre par catégorie */}
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-background text-text-primary">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-background text-text-primary">{category.name}</option>
                  ))}
                </select>

                {/* Filtre par année */}
                <select
                  value={selectedYear || ''}
                  onChange={(e) => setSelectedYear(e.target.value || null)}
                  className="px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-background text-text-primary">Toutes les années</option>
                  {Array.from(new Set(projects.map(p => p.year))).sort().reverse().map(year => (
                    <option key={year} value={year} className="bg-background text-text-primary">{year}</option>
                  ))}
                </select>

                {/* Bouton reset */}
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Liste des projets */}
            {currentProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {currentProjects.map(project => (
                    <div key={`project-${project.id}`} className="glass rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-text-primary">{project.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{project.description}</p>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-text-secondary">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      
                      {/* Numéros de page */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 border border-white/10 text-text-primary hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-8 h-8 text-text-secondary" />
                </div>
                <h4 className="text-text-primary font-medium mb-2">Aucun projet trouvé</h4>
                <p className="text-text-secondary text-sm">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">Gestion des Catégories</h2>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center space-x-2 px-4 py-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une catégorie</span>
            </button>
          </div>

          {showCategoryForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleCreateCategory}
              className="glass rounded-2xl p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Nom</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                  placeholder="Nom de la catégorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan h-20"
                  placeholder="Description de la catégorie"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex items-center space-x-2 px-4 py-2 btn-primary">
                  <Save className="w-4 h-4" />
                  <span>Créer la catégorie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            </motion.form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={`admin-category-${category.id}`} className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{category.name}</h4>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'technologies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">Gestion des Technologies</h2>
            <button
              onClick={() => setShowTechnologyForm(!showTechnologyForm)}
              className="flex items-center space-x-2 px-4 py-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une technologie</span>
            </button>
          </div>

          {showTechnologyForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleCreateTechnology}
              className="glass rounded-2xl p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Nom</label>
                  <input
                    type="text"
                    value={newTechnology.name}
                    onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
                    className="w-full px-4 py-2 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="Nom de la technologie"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={newTechnology.category}
                    onChange={(e) => setNewTechnology({ ...newTechnology, category: e.target.value })}
                    className="w-full px-4 py-2 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="Catégorie (ex: Frontend, Backend)"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex items-center space-x-2 px-4 py-2 btn-primary">
                  <Save className="w-4 h-4" />
                  <span>Créer la technologie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTechnologyForm(false)}
                  className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            </motion.form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map(technology => (
              <div key={`admin-technology-${technology.id}`} className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{technology.name}</h4>
                  <button
                    onClick={() => handleDeleteTechnology(technology.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary">{technology.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />
    </div>
  )
}

export default AdminContent
