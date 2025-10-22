import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, createProject, initDatabase } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// Initialiser la base de données
let isInitialized = false
async function ensureDatabaseInitialized() {
  if (!isInitialized) {
    try {
      await initDatabase()
      isInitialized = true
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Database initialization error:', error)
    }
  }
}

// GET - Récupérer tous les projets
export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseInitialized()
    const projects = await getAllProjects()

    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseInitialized()
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { title, description, image, technologies, category_id, github, demo, featured, status, year } = await request.json()

    if (!title || !description || !technologies || !category_id || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

        const newProject = await createProject({
      title,
      description,
      image: image || null,
      technologies,
      category_id,
      github: github || null,
      demo: demo || null,
      featured: Boolean(featured),
      status: status || 'completed',
      year
    })

    return NextResponse.json({ 
      success: true, 
      project: newProject
    })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
