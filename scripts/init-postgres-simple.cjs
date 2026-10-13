const { Pool } = require('pg')
const pgConfig = require('./pg-config.cjs')
const bcrypt = require('bcryptjs')

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  ...pgConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

async function initDatabase() {
  try {
    console.log('🔄 Connexion à PostgreSQL...')
    
    // Tester la connexion
    const client = await pool.connect()
    console.log('✅ Connexion à PostgreSQL réussie!')
    
    // Créer les tables
    console.log('🔄 Création des tables...')
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) DEFAULT 'Autre',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_technologies (
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, technology_id)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS featured_projects (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Tables créées avec succès!')

    // Vérifier si l'utilisateur admin existe
    const adminExists = await client.query('SELECT id FROM users WHERE username = $1', ['admin'])
    
    if (adminExists.rows.length === 0 && !process.env.ADMIN_PASSWORD) {
      console.log('⚠️ ADMIN_PASSWORD non défini : utilisateur admin non créé (voir .env.example)')
    } else if (adminExists.rows.length === 0) {
      console.log('🔄 Création de l\'utilisateur admin...')
      const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword])
      console.log('✅ Utilisateur admin créé!')
    } else {
      console.log('ℹ️ Utilisateur admin existe déjà')
    }

    // Insérer les catégories par défaut
    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories')
    if (categoriesCount.rows[0].count === '0') {
      console.log('🔄 Insertion des catégories par défaut...')
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
        await client.query('INSERT INTO categories (name, description) VALUES ($1, $2)', [name, description])
      }
      console.log('✅ Catégories insérées!')
    } else {
      console.log('ℹ️ Catégories existent déjà')
    }

    // Insérer les technologies par défaut
    const technologiesCount = await client.query('SELECT COUNT(*) FROM technologies')
    if (technologiesCount.rows[0].count === '0') {
      console.log('🔄 Insertion des technologies par défaut...')
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
        await client.query('INSERT INTO technologies (name, category) VALUES ($1, $2)', [name, category])
      }
      console.log('✅ Technologies insérées!')
    } else {
      console.log('ℹ️ Technologies existent déjà')
    }

    // Insérer les projets par défaut
    const projectsCount = await client.query('SELECT COUNT(*) FROM projects')
    if (projectsCount.rows[0].count === '0') {
      console.log('🔄 Insertion des projets par défaut...')
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
        const result = await client.query(`
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
            await client.query('INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)', [pt.project_id, pt.technology_id])
          }
        }
      }

      // Ajouter les projets à la une
      await client.query('INSERT INTO featured_projects (project_id, position) VALUES ($1, $2)', [1, 1])
      await client.query('INSERT INTO featured_projects (project_id, position) VALUES ($1, $2)', [2, 2])
      
      console.log('✅ Projets insérés!')
    } else {
      console.log('ℹ️ Projets existent déjà')
    }

    client.release()
    console.log('✅ Base de données PostgreSQL initialisée avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
    throw error
  }
}

async function main() {
  try {
    await initDatabase()
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
