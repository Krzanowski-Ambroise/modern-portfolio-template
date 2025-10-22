'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Filter, 
  Search, 
  Github, 
  ExternalLink,
  Shield,
  Code,
  Lock,
  Network,
  Database,
  Cloud,
  Zap,
  Eye,
  Terminal
} from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import ProjectFilter from '@/components/ProjectFilter'

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'Tous', icon: Filter },
    { id: 'api', label: 'API Sécurisée', icon: Code },
    { id: 'monitoring', label: 'Monitoring', icon: Eye },
    { id: 'forensics', label: 'Forensique', icon: Shield },
    { id: 'network', label: 'Réseaux', icon: Network },
    { id: 'cloud', label: 'Cloud', icon: Cloud },
  ]

  const projects = [
    {
      id: 1,
      title: 'SecureAuth API',
      description: 'API d\'authentification sécurisée avec JWT, 2FA et chiffrement AES-256. Architecture microservices avec rate limiting et monitoring avancé.',
      image: '/api/projects/secureauth.jpg',
      technologies: ['Node.js', 'JWT', '2FA', 'AES-256', 'Docker', 'Redis'],
      category: 'api',
      icon: Shield,
      color: 'from-primary-cyan to-primary-violet',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      status: 'completed',
      year: '2024'
    },
    {
      id: 2,
      title: 'CyberThreat Monitor',
      description: 'Dashboard de monitoring en temps réel avec détection d\'anomalies par IA. Intégration SIEM et alertes automatiques.',
      image: '/api/projects/monitor.jpg',
      technologies: ['React', 'Python', 'ML', 'ELK Stack', 'WebSocket', 'D3.js'],
      category: 'monitoring',
      icon: Network,
      color: 'from-primary-violet to-primary-pink',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      status: 'completed',
      year: '2024'
    },
    {
      id: 3,
      title: 'SecureVault',
      description: 'Gestionnaire de mots de passe sécurisé avec chiffrement end-to-end. Interface intuitive et synchronisation cloud.',
      image: '/api/projects/vault.jpg',
      technologies: ['React', 'AES-256', 'Cloud', 'PWA', 'Biometric', 'WebCrypto'],
      category: 'api',
      icon: Lock,
      color: 'from-primary-pink to-primary-cyan',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    },
    {
      id: 4,
      title: 'Network Security Scanner',
      description: 'Scanner de vulnérabilités réseau automatisé avec rapport détaillé. Intégration avec outils de sécurité existants.',
      image: '/api/projects/scanner.jpg',
      technologies: ['Python', 'Nmap', 'Nessus', 'API', 'Automation', 'Report'],
      category: 'network',
      icon: Zap,
      color: 'from-primary-cyan to-primary-violet',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    },
    {
      id: 5,
      title: 'Digital Forensics Toolkit',
      description: 'Suite d\'outils forensiques pour l\'investigation numérique. Analyse de disques, mémoire et artefacts.',
      image: '/api/projects/forensics.jpg',
      technologies: ['Python', 'Volatility', 'Autopsy', 'FTK', 'EnCase', 'Timeline'],
      category: 'forensics',
      icon: Eye,
      color: 'from-primary-violet to-primary-pink',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      status: 'in-progress',
      year: '2024'
    },
    {
      id: 6,
      title: 'Cloud Security Orchestrator',
      description: 'Plateforme de gestion de sécurité cloud multi-fournisseur. Automatisation des politiques et monitoring.',
      image: '/api/projects/cloud.jpg',
      technologies: ['Terraform', 'AWS', 'Azure', 'Kubernetes', 'Policy', 'Automation'],
      category: 'cloud',
      icon: Cloud,
      color: 'from-primary-pink to-primary-cyan',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    },
    {
      id: 7,
      title: 'Threat Intelligence Platform',
      description: 'Plateforme d\'intelligence des menaces avec sources multiples. Corrélation et analyse prédictive.',
      image: '/api/projects/threat.jpg',
      technologies: ['Python', 'ML', 'API', 'Database', 'Visualization', 'Real-time'],
      category: 'monitoring',
      icon: Database,
      color: 'from-primary-cyan to-primary-violet',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    },
    {
      id: 8,
      title: 'Secure Code Analyzer',
      description: 'Analyseur de code statique pour détecter les vulnérabilités. Intégration CI/CD et rapports détaillés.',
      image: '/api/projects/analyzer.jpg',
      technologies: ['AST', 'Python', 'SAST', 'CI/CD', 'Reports', 'Integration'],
      category: 'api',
      icon: Terminal,
      color: 'from-primary-violet to-primary-pink',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
      status: 'completed',
      year: '2023'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom section-padding">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mes <span className="gradient-text">projets</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-text-secondary mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Découvrez mes réalisations en cybersécurité, du développement d'APIs sécurisées 
              aux solutions de monitoring avancées. Chaque projet illustre mon expertise technique.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8">
        <div className="container-custom section-padding">
          <ProjectFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 pb-24">
        <div className="container-custom section-padding">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-text-secondary">
                Essayez de modifier vos critères de recherche
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage


