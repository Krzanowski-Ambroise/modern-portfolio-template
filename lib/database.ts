import sqlite3 from 'sqlite3'
import path from 'path'
import { promisify } from 'util'

const dbPath = path.join(process.cwd(), 'database.sqlite')
const db = new sqlite3.Database(dbPath)

// Promisify les méthodes de base de données
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))
const dbExec = promisify(db.exec.bind(db))

// Initialiser les tables
export async function initDatabase() {
  try {
    // Table des utilisateurs
    await dbExec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Table des projets
    await dbExec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        technologies TEXT NOT NULL,
        category TEXT NOT NULL,
        github TEXT,
        demo TEXT,
        featured BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'completed',
        year TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Table des projets à la une
    await dbExec(`
      CREATE TABLE IF NOT EXISTS featured_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `)

    // Insérer un utilisateur admin par défaut (mot de passe: admin123)
    const adminExists = await dbGet('SELECT id FROM users WHERE username = ?', ['admin'])
    if (!adminExists) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      await dbRun('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword])
    }

    // Insérer des projets par défaut
    const projectsCount = await dbGet('SELECT COUNT(*) as count FROM projects') as { count: number }
    if (projectsCount.count === 0) {
      const defaultProjects = [
        {
          title: 'SecureAuth API',
          description: 'API d\'authentification sécurisée avec JWT, 2FA et chiffrement AES-256. Architecture microservices avec rate limiting et monitoring avancé.',
          image: '/api/projects/secureauth.jpg',
          technologies: JSON.stringify(['Node.js', 'JWT', '2FA', 'AES-256', 'Docker', 'Redis']),
          category: 'api',
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: 1,
          status: 'completed',
          year: '2024'
        },
        {
          title: 'CyberThreat Monitor',
          description: 'Dashboard de monitoring en temps réel avec détection d\'anomalies par IA. Intégration SIEM et alertes automatiques.',
          image: '/api/projects/monitor.jpg',
          technologies: JSON.stringify(['React', 'Python', 'ML', 'ELK Stack', 'WebSocket', 'D3.js']),
          category: 'monitoring',
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: 1,
          status: 'completed',
          year: '2024'
        },
        {
          title: 'SecureVault',
          description: 'Gestionnaire de mots de passe sécurisé avec chiffrement end-to-end. Interface intuitive et synchronisation cloud.',
          image: '/api/projects/vault.jpg',
          technologies: JSON.stringify(['React', 'AES-256', 'Cloud', 'PWA', 'Biometric', 'WebCrypto']),
          category: 'api',
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: 0,
          status: 'completed',
          year: '2023'
        },
        {
          title: 'Network Security Scanner',
          description: 'Scanner de vulnérabilités réseau automatisé avec rapport détaillé. Intégration avec outils de sécurité existants.',
          image: '/api/projects/scanner.jpg',
          technologies: JSON.stringify(['Python', 'Nmap', 'Nessus', 'API', 'Automation', 'Report']),
          category: 'network',
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: 0,
          status: 'completed',
          year: '2023'
        }
      ]

      for (const project of defaultProjects) {
        await dbRun(`
          INSERT INTO projects (title, description, image, technologies, category, github, demo, featured, status, year)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          project.title,
          project.description,
          project.image,
          project.technologies,
          project.category,
          project.github,
          project.demo,
          project.featured,
          project.status,
          project.year
        ])
      }

      // Marquer les 2 premiers projets comme featured
      const featuredProjects = await dbAll('SELECT id FROM projects WHERE featured = 1 ORDER BY id LIMIT 2')
      
      for (let i = 0; i < featuredProjects.length; i++) {
        await dbRun('INSERT INTO featured_projects (project_id, position) VALUES (?, ?)', [
          (featuredProjects[i] as any).id, 
          i + 1
        ])
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

export { db, dbRun, dbGet, dbAll, dbExec }
