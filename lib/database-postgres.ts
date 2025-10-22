import { Pool, PoolClient } from 'pg'
import bcrypt from 'bcryptjs'

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Interface pour les types de données
export interface User {
  id: number
  username: string
  password: string
  created_at: Date
}

export interface Category {
  id: number
  name: string
  description: string
  created_at: Date
}

export interface Technology {
  id: number
  name: string
  category: string
  created_at: Date
}

export interface Project {
  id: number
  title: string
  description: string
  image: string
  category_id: number
  github: string
  demo: string
  featured: boolean
  status: string
  year: string
  created_at: Date
  updated_at: Date
}

export interface ProjectTechnology {
  project_id: number
  technology_id: number
}

export interface FeaturedProject {
  id: number
  project_id: number
  position: number
  created_at: Date
}

export interface Profile {
  id: number
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  cv_file: string
  cv_path: string
  current_cv_id: number | null
  updated_at: Date
}

export interface CVFile {
  id: number
  original_name: string
  filename: string
  file_path: string
  file_size: number
  upload_date: Date
  is_current: boolean
}

export interface DocumentFolder {
  id: number
  name: string
  description: string | null
  parent_id: number | null
  is_native: boolean
  is_secure: boolean
  created_at: Date
  updated_at: Date
  children?: DocumentFolder[]
  documents?: Document[]
}

export interface Document {
  id: number
  name: string
  original_name: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  folder_id: number
  is_protected: boolean
  upload_date: Date
  updated_at: Date
}

export interface Diploma {
  id: number
  name: string
  institution: string
  obtained_date: Date
  document_id: number | null
  created_at: Date
  updated_at: Date
  document?: Document
}

export interface DiplomaFile {
  id: number
  diploma_id: number
  original_name: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  upload_date: Date
  created_at: Date
}

// Fonction pour exécuter des requêtes
export async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Fonction pour obtenir un client de base de données
export async function getClient(): Promise<PoolClient> {
  return await pool.connect()
}

// Initialiser la base de données
export async function initDatabase(): Promise<void> {
  try {
    // Créer les tables
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) DEFAULT 'Autre',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        category_id INTEGER REFERENCES categories(id),
        github TEXT,
        demo TEXT,
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'completed',
        year VARCHAR(4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS project_technologies (
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, technology_id)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS featured_projects (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title TEXT,
        email VARCHAR(255),
        phone VARCHAR(50),
        location VARCHAR(255),
        github VARCHAR(500),
        linkedin VARCHAR(500),
        cv_file VARCHAR(255),
        cv_path VARCHAR(500),
        current_cv_id INTEGER,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS cv_files (
        id SERIAL PRIMARY KEY,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_current BOOLEAN DEFAULT FALSE
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS document_folders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        parent_id INTEGER REFERENCES document_folders(id) ON DELETE CASCADE,
        is_native BOOLEAN DEFAULT FALSE,
        is_secure BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        folder_id INTEGER REFERENCES document_folders(id) ON DELETE CASCADE,
        is_protected BOOLEAN DEFAULT FALSE,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS diplomas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        obtained_date DATE NOT NULL,
        document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS diploma_files (
        id SERIAL PRIMARY KEY,
        diploma_id INTEGER REFERENCES diplomas(id) ON DELETE CASCADE,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Vérifier si l'utilisateur admin existe
    const adminExists = await query('SELECT id FROM users WHERE username = $1', ['admin'])
    
    if (adminExists.rows.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      await query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword])
    }

    // Insérer les catégories par défaut
    const categoriesCount = await query('SELECT COUNT(*) FROM categories')
    if (categoriesCount.rows[0].count === '0') {
      const defaultCategories = [
        ['API', 'Interfaces de programmation'],
        ['Web', 'Applications web'],
        ['Mobile', 'Applications mobiles'],
        ['Desktop', 'Applications desktop'],
        ['Sécurité', 'Outils de sécurité'],
        ['Monitoring', 'Outils de surveillance'],
        ['Réseau', 'Outils réseau']
      ]

      for (const [name, description] of defaultCategories) {
        await query('INSERT INTO categories (name, description) VALUES ($1, $2)', [name, description])
      }
    }

    // Insérer les technologies par défaut
    const technologiesCount = await query('SELECT COUNT(*) FROM technologies')
    if (technologiesCount.rows[0].count === '0') {
      const defaultTechnologies = [
        ['JavaScript', 'Frontend'],
        ['TypeScript', 'Frontend'],
        ['React', 'Frontend'],
        ['Node.js', 'Backend'],
        ['Python', 'Backend'],
        ['Docker', 'DevOps'],
        ['AWS', 'Cloud'],
        ['JWT', 'Sécurité'],
        ['AES-256', 'Sécurité'],
        ['Nmap', 'Sécurité'],
        ['Burp Suite', 'Sécurité'],
        ['OWASP ZAP', 'Sécurité']
      ]

      for (const [name, category] of defaultTechnologies) {
        await query('INSERT INTO technologies (name, category) VALUES ($1, $2)', [name, category])
      }
    }

    // Insérer les projets par défaut
    const projectsCount = await query('SELECT COUNT(*) FROM projects')
    if (projectsCount.rows[0].count === '0') {
      const defaultProjects = [
        {
          title: 'SecureAuth API',
          description: 'API d\'authentification sécurisée avec JWT, 2FA et chiffrement AES-256. Architecture microservices avec rate limiting et monitoring avancé.',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
          category_id: 1,
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          status: 'completed',
          year: '2024'
        },
        {
          title: 'CyberThreat Monitor',
          description: 'Dashboard de monitoring en temps réel avec détection d\'anomalies par IA. Intégration SIEM et alertes automatiques.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
          category_id: 6,
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          status: 'completed',
          year: '2024'
        },
        {
          title: 'SecureVault',
          description: 'Gestionnaire de mots de passe sécurisé avec chiffrement end-to-end. Interface intuitive et synchronisation cloud.',
          image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop',
          category_id: 2,
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: false,
          status: 'completed',
          year: '2023'
        },
        {
          title: 'Network Security Scanner',
          description: 'Scanner de vulnérabilités réseau automatisé avec rapport détaillé. Intégration avec outils de sécurité existants.',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop',
          category_id: 7,
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: false,
          status: 'completed',
          year: '2023'
        }
      ]

      for (const project of defaultProjects) {
        const result = await query(`
          INSERT INTO projects (title, description, image, category_id, github, demo, featured, status, year)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [
          project.title,
          project.description,
          project.image,
          project.category_id,
          project.github,
          project.demo,
          project.featured,
          project.status,
          project.year
        ])

        const projectId = result.rows[0].id

        // Ajouter les relations projet-technologies
        const projectTechnologies = [
          { project_id: 1, technology_id: 4 }, // Node.js
          { project_id: 1, technology_id: 8 }, // JWT
          { project_id: 1, technology_id: 9 }, // AES-256
          { project_id: 1, technology_id: 6 }, // Docker
          { project_id: 2, technology_id: 1 }, // JavaScript
          { project_id: 2, technology_id: 3 }, // React
          { project_id: 2, technology_id: 5 }, // Python
          { project_id: 3, technology_id: 1 }, // JavaScript
          { project_id: 3, technology_id: 3 }, // React
          { project_id: 3, technology_id: 9 }, // AES-256
          { project_id: 4, technology_id: 5 }, // Python
          { project_id: 4, technology_id: 10 }, // Nmap
          { project_id: 4, technology_id: 11 }, // Burp Suite
        ]

        for (const pt of projectTechnologies) {
          if (pt.project_id === projectId) {
            await query('INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)', [pt.project_id, pt.technology_id])
          }
        }
      }

      // Ajouter les projets à la une
      await query('INSERT INTO featured_projects (project_id, position) VALUES ($1, $2)', [1, 1])
      await query('INSERT INTO featured_projects (project_id, position) VALUES ($1, $2)', [2, 2])
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Fonctions pour les utilisateurs
export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE username = $1', [username])
  return result.rows[0] || null
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0] || null
}

// Fonctions pour les catégories
export async function getAllCategories(): Promise<Category[]> {
  const result = await query('SELECT * FROM categories ORDER BY name')
  return result.rows
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createCategory(categoryData: { name: string; description: string }): Promise<Category> {
  const result = await query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [categoryData.name, categoryData.description]
  )
  return result.rows[0]
}

export async function updateCategory(id: number, categoryData: { name: string; description: string }): Promise<Category | null> {
  const result = await query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [categoryData.name, categoryData.description, id]
  )
  return result.rows[0] || null
}

export async function deleteCategory(id: number): Promise<boolean> {
  const result = await query('DELETE FROM categories WHERE id = $1', [id])
  return result.rowCount > 0
}

// Fonctions pour les technologies
export async function getAllTechnologies(): Promise<Technology[]> {
  const result = await query('SELECT * FROM technologies ORDER BY name')
  return result.rows
}

export async function getTechnologyById(id: number): Promise<Technology | null> {
  const result = await query('SELECT * FROM technologies WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createTechnology(name: string, category: string = 'Autre'): Promise<Technology> {
  const result = await query(
    'INSERT INTO technologies (name, category) VALUES ($1, $2) RETURNING *',
    [name, category]
  )
  return result.rows[0]
}

export async function updateTechnology(id: number, technologyData: { name: string; category: string }): Promise<Technology | null> {
  const result = await query(
    'UPDATE technologies SET name = $1, category = $2 WHERE id = $3 RETURNING *',
    [technologyData.name, technologyData.category, id]
  )
  return result.rows[0] || null
}

export async function deleteTechnology(id: number): Promise<boolean> {
  const result = await query('DELETE FROM technologies WHERE id = $1', [id])
  return result.rowCount > 0
}

// Fonctions pour les projets
export async function getAllProjects(): Promise<any[]> {
  const result = await query(`
    SELECT 
      p.*,
      c.name as category,
      fp.position as featured_position
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN featured_projects fp ON p.id = fp.project_id
    ORDER BY fp.position ASC, p.created_at DESC
  `)

  // Récupérer les technologies pour chaque projet
  const projectsWithTechnologies = await Promise.all(
    result.rows.map(async (project) => {
      const techResult = await query(`
        SELECT t.* FROM technologies t
        JOIN project_technologies pt ON t.id = pt.technology_id
        WHERE pt.project_id = $1
        ORDER BY t.name
      `, [project.id])

      return {
        ...project,
        technologies: techResult.rows
      }
    })
  )

  return projectsWithTechnologies
}

export async function getProjectById(id: number): Promise<any | null> {
  const result = await query(`
    SELECT 
      p.*,
      c.name as category
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id])

  if (result.rows.length === 0) return null

  const project = result.rows[0]

  // Récupérer les technologies
  const techResult = await query(`
    SELECT t.* FROM technologies t
    JOIN project_technologies pt ON t.id = pt.technology_id
    WHERE pt.project_id = $1
    ORDER BY t.name
  `, [id])

  return {
    ...project,
    technologies: techResult.rows
  }
}

export async function createProject(projectData: any): Promise<Project> {
  const client = await getClient()
  try {
    await client.query('BEGIN')

    const result = await client.query(`
      INSERT INTO projects (title, description, image, category_id, github, demo, featured, status, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      projectData.title,
      projectData.description,
      projectData.image,
      projectData.category_id,
      projectData.github,
      projectData.demo,
      projectData.featured,
      projectData.status,
      projectData.year
    ])

    const project = result.rows[0]

    // Ajouter les relations technologies
    if (projectData.technologies && Array.isArray(projectData.technologies)) {
      for (const techId of projectData.technologies) {
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [project.id, techId]
        )
      }
    }

    await client.query('COMMIT')
    return project
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateProject(id: number, projectData: any): Promise<Project | null> {
  const client = await getClient()
  try {
    await client.query('BEGIN')

    const result = await client.query(`
      UPDATE projects 
      SET title = $1, description = $2, image = $3, category_id = $4, github = $5, demo = $6, featured = $7, status = $8, year = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      projectData.title,
      projectData.description,
      projectData.image,
      projectData.category_id,
      projectData.github,
      projectData.demo,
      projectData.featured,
      projectData.status,
      projectData.year,
      id
    ])

    if (result.rows.length === 0) {
      await client.query('ROLLBACK')
      return null
    }

    const project = result.rows[0]

    // Mettre à jour les relations technologies
    if (projectData.technologies && Array.isArray(projectData.technologies)) {
      // Supprimer les anciennes relations
      await client.query('DELETE FROM project_technologies WHERE project_id = $1', [id])
      
      // Ajouter les nouvelles relations
      for (const techId of projectData.technologies) {
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [id, techId]
        )
      }
    }

    await client.query('COMMIT')
    return project
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await query('DELETE FROM projects WHERE id = $1', [id])
  return result.rowCount > 0
}

// Fonctions pour les projets à la une
export async function getFeaturedProjects(): Promise<any[]> {
  const result = await query(`
    SELECT 
      p.*,
      c.name as category,
      fp.position
    FROM featured_projects fp
    JOIN projects p ON fp.project_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY fp.position ASC
  `)

  // Récupérer les technologies pour chaque projet
  const projectsWithTechnologies = await Promise.all(
    result.rows.map(async (project) => {
      const techResult = await query(`
        SELECT t.* FROM technologies t
        JOIN project_technologies pt ON t.id = pt.technology_id
        WHERE pt.project_id = $1
        ORDER BY t.name
      `, [project.id])

      return {
        ...project,
        technologies: techResult.rows,
        featured: true
      }
    })
  )

  return projectsWithTechnologies
}

export async function updateFeaturedProjects(projectIds: number[]): Promise<void> {
  const client = await getClient()
  try {
    await client.query('BEGIN')

    // Supprimer les anciens projets à la une
    await client.query('DELETE FROM featured_projects')

    // Ajouter les nouveaux projets à la une
    for (let i = 0; i < projectIds.length; i++) {
      await client.query(
        'INSERT INTO featured_projects (project_id, position) VALUES ($1, $2)',
        [projectIds[i], i + 1]
      )
    }

    // Mettre à jour le statut featured des projets
    await client.query('UPDATE projects SET featured = FALSE')
    if (projectIds.length > 0) {
      await client.query(
        'UPDATE projects SET featured = TRUE WHERE id = ANY($1)',
        [projectIds]
      )
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Fonctions pour gérer le profil
export async function getProfile(): Promise<Profile | null> {
  const result = await query('SELECT * FROM profile ORDER BY id DESC LIMIT 1')
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createProfile(profileData: Partial<Profile>): Promise<Profile> {
  const result = await query(`
    INSERT INTO profile (name, title, email, phone, location, github, linkedin, cv_file, cv_path)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [
    profileData.name,
    profileData.title,
    profileData.email,
    profileData.phone,
    profileData.location,
    profileData.github,
    profileData.linkedin,
    profileData.cv_file,
    profileData.cv_path
  ])
  return result.rows[0]
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  // Vérifier si un profil existe
  const existingProfile = await getProfile()
  
  if (existingProfile) {
    // Mettre à jour le profil existant
    const result = await query(`
      UPDATE profile 
      SET name = $1, title = $2, email = $3, phone = $4, location = $5, 
          github = $6, linkedin = $7, cv_file = $8, cv_path = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      profileData.name,
      profileData.title,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.github,
      profileData.linkedin,
      profileData.cv_file,
      profileData.cv_path,
      existingProfile.id
    ])
    return result.rows[0]
  } else {
    // Créer un nouveau profil
    return await createProfile(profileData)
  }
}

// Fonctions pour gérer les fichiers CV
export async function getAllCVFiles(): Promise<CVFile[]> {
  const result = await query('SELECT * FROM cv_files ORDER BY upload_date DESC')
  return result.rows
}

export async function getCurrentCVFile(): Promise<CVFile | null> {
  const result = await query('SELECT * FROM cv_files WHERE is_current = TRUE LIMIT 1')
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createCVFile(cvData: {
  original_name: string
  filename: string
  file_path: string
  file_size: number
}): Promise<CVFile> {
  const result = await query(`
    INSERT INTO cv_files (original_name, filename, file_path, file_size)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [cvData.original_name, cvData.filename, cvData.file_path, cvData.file_size])
  return result.rows[0]
}

export async function setCurrentCV(cvId: number): Promise<void> {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    
    // Désactiver tous les CV actuels
    await client.query('UPDATE cv_files SET is_current = FALSE')
    
    // Activer le CV sélectionné
    await client.query('UPDATE cv_files SET is_current = TRUE WHERE id = $1', [cvId])
    
    // Mettre à jour le profil
    const cvFile = await client.query('SELECT * FROM cv_files WHERE id = $1', [cvId])
    if (cvFile.rows.length > 0) {
      const file = cvFile.rows[0]
      await client.query(`
        UPDATE profile 
        SET cv_file = $1, cv_path = $2, current_cv_id = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [file.original_name, file.file_path, cvId])
    }
    
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function deleteCVFile(cvId: number): Promise<void> {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    
    // Récupérer les infos du fichier pour le supprimer du disque
    const cvFile = await client.query('SELECT * FROM cv_files WHERE id = $1', [cvId])
    
    // Supprimer de la base de données
    await client.query('DELETE FROM cv_files WHERE id = $1', [cvId])
    
    // Si c'était le CV actuel, réinitialiser le profil
    if (cvFile.rows.length > 0 && cvFile.rows[0].is_current) {
      await client.query(`
        UPDATE profile 
        SET cv_file = '', cv_path = '', current_cv_id = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `)
    }
    
    await client.query('COMMIT')
    
    // Supprimer le fichier du disque
    if (cvFile.rows.length > 0) {
      const fs = await import('fs/promises')
      const path = await import('path')
      try {
        const filePath = path.join(process.cwd(), 'public', 'cv', cvFile.rows[0].filename)
        await fs.unlink(filePath)
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error)
      }
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// ===== FONCTIONS POUR LES DOCUMENTS =====

export async function getAllDocumentFolders(): Promise<DocumentFolder[]> {
  const result = await query(`
    SELECT * FROM document_folders 
    ORDER BY is_native DESC, name ASC
  `)
  return result.rows
}

export async function getDocumentFolderById(id: number): Promise<DocumentFolder | null> {
  const result = await query('SELECT * FROM document_folders WHERE id = $1', [id])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createDocumentFolder(folderData: {
  name: string
  description?: string
  parent_id?: number
  is_native?: boolean
}): Promise<DocumentFolder> {
  const result = await query(`
    INSERT INTO document_folders (name, description, parent_id, is_native)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [folderData.name, folderData.description || null, folderData.parent_id || null, folderData.is_native || false])
  return result.rows[0]
}

export async function updateDocumentFolder(id: number, folderData: {
  name?: string
  description?: string
  parent_id?: number
}): Promise<DocumentFolder> {
  const result = await query(`
    UPDATE document_folders 
    SET name = COALESCE($2, name), 
        description = COALESCE($3, description), 
        parent_id = COALESCE($4, parent_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [id, folderData.name, folderData.description, folderData.parent_id])
  return result.rows[0]
}

export async function deleteDocumentFolder(id: number): Promise<void> {
  await query('DELETE FROM document_folders WHERE id = $1 AND is_native = FALSE', [id])
}

export async function getAllDocuments(): Promise<Document[]> {
  const result = await query(`
    SELECT d.*, df.name as folder_name 
    FROM documents d
    LEFT JOIN document_folders df ON d.folder_id = df.id
    ORDER BY d.upload_date DESC
  `)
  return result.rows
}

export async function getDocumentsByFolder(folderId: number | null): Promise<Document[]> {
  const result = await query(`
    SELECT * FROM documents 
    WHERE folder_id ${folderId === null ? 'IS NULL' : '= $1'} 
    ORDER BY upload_date DESC
  `, folderId === null ? [] : [folderId])
  return result.rows
}

export async function createDocument(documentData: {
  name: string
  original_name: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  folder_id: number
  is_protected?: boolean
}): Promise<Document> {
  const result = await query(`
    INSERT INTO documents (name, original_name, filename, file_path, file_size, file_type, folder_id, is_protected)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    documentData.name,
    documentData.original_name,
    documentData.filename,
    documentData.file_path,
    documentData.file_size,
    documentData.file_type,
    documentData.folder_id,
    documentData.is_protected || false
  ])
  return result.rows[0]
}

export async function updateDocument(id: number, documentData: {
  name?: string
  is_protected?: boolean
}): Promise<Document> {
  const result = await query(`
    UPDATE documents 
    SET name = COALESCE($2, name), 
        is_protected = COALESCE($3, is_protected),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [id, documentData.name, documentData.is_protected])
  return result.rows[0]
}

export async function deleteDocument(id: number): Promise<void> {
  await query('DELETE FROM documents WHERE id = $1 AND is_protected = FALSE', [id])
}

// ===== FONCTIONS POUR LES DIPLÔMES =====

export async function getAllDiplomas(): Promise<Diploma[]> {
  const result = await query(`
    SELECT d.*, doc.name as document_name, doc.file_path
    FROM diplomas d
    LEFT JOIN documents doc ON d.document_id = doc.id
    ORDER BY d.obtained_date DESC
  `)
  return result.rows
}

export async function createDiploma(diplomaData: {
  name: string
  institution: string
  obtained_date: Date
  document_id?: number
}): Promise<Diploma> {
  const result = await query(`
    INSERT INTO diplomas (name, institution, obtained_date, document_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [diplomaData.name, diplomaData.institution, diplomaData.obtained_date, diplomaData.document_id || null])
  return result.rows[0]
}

export async function updateDiploma(id: number, diplomaData: {
  name?: string
  institution?: string
  obtained_date?: Date
  document_id?: number
}): Promise<Diploma> {
  const result = await query(`
    UPDATE diplomas 
    SET name = COALESCE($2, name),
        institution = COALESCE($3, institution),
        obtained_date = COALESCE($4, obtained_date),
        document_id = COALESCE($5, document_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [id, diplomaData.name, diplomaData.institution, diplomaData.obtained_date, diplomaData.document_id])
  return result.rows[0]
}

export async function deleteDiploma(id: number): Promise<void> {
  await query('DELETE FROM diplomas WHERE id = $1', [id])
}

// ===== FONCTIONS POUR LES FICHIERS DE DIPLÔMES =====

export async function getDiplomaFiles(diplomaId: number): Promise<DiplomaFile[]> {
  const result = await query(`
    SELECT * FROM diploma_files 
    WHERE diploma_id = $1 
    ORDER BY upload_date DESC
  `, [diplomaId])
  return result.rows
}

export async function createDiplomaFile(fileData: {
  diploma_id: number
  original_name: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
}): Promise<DiplomaFile> {
  const result = await query(`
    INSERT INTO diploma_files (diploma_id, original_name, filename, file_path, file_size, file_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [
    fileData.diploma_id,
    fileData.original_name,
    fileData.filename,
    fileData.file_path,
    fileData.file_size,
    fileData.file_type
  ])
  return result.rows[0]
}

export async function deleteDiplomaFile(id: number): Promise<void> {
  await query('DELETE FROM diploma_files WHERE id = $1', [id])
}

export async function getDiplomaFileById(id: number): Promise<DiplomaFile | null> {
  const result = await query('SELECT * FROM diploma_files WHERE id = $1', [id])
  return result.rows[0] || null
}

// Fermer la connexion
export async function closeDatabase(): Promise<void> {
  await pool.end()
}

export { pool }
