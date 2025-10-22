'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminContent from '@/components/admin/AdminContent'

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

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // États pour les données
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
        
        if (response.ok) {
          setIsAuthenticated(true)
          loadData()
        } else {
          localStorage.removeItem('adminToken')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('adminToken')
      }
    }
    setIsLoading(false)
  }

  const loadData = async () => {
    await Promise.all([
      loadProjects(),
      loadCategories(),
      loadTechnologies()
    ])
  }

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      // Transformer les technologies en IDs pour l'interface admin
      const transformedProjects = data.projects.map((project: any) => ({
        ...project,
        technologies: project.technologies.map((tech: any) => tech.id)
      }))
      
      setProjects(transformedProjects)
      
      const featured = transformedProjects.filter((p: Project) => p.featured_position)
      setFeaturedProjects(featured)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadTechnologies = async () => {
    try {
      const response = await fetch('/api/technologies')
      const data = await response.json()
      setTechnologies(data.technologies)
    } catch (error) {
      console.error('Failed to load technologies:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        loadData()
      } else {
        alert('Identifiants incorrects')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('Erreur de connexion')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  const handleUpdateFeaturedProjects = async (projectIds: number[]) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projectIds })
      })
      
      if (response.ok) {
        loadProjects()
      } else {
        alert('Erreur lors de la mise à jour des projets à la une')
      }
    } catch (error) {
      console.error('Update featured projects failed:', error)
      alert('Erreur lors de la mise à jour des projets à la une')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-primary-cyan mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">Administration</h1>
            <p className="text-text-secondary">Connectez-vous pour accéder au panel d'administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3"
            >
              Se connecter
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <AdminContent
        activeSection={activeSection}
        projects={projects}
        categories={categories}
        technologies={technologies}
        featuredProjects={featuredProjects}
        onLoadProjects={loadProjects}
        onLoadCategories={loadCategories}
        onLoadTechnologies={loadTechnologies}
        onUpdateFeaturedProjects={handleUpdateFeaturedProjects}
      />
    </div>
  )
}

export default AdminPanel