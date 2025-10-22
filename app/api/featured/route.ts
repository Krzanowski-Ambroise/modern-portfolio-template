import { NextRequest, NextResponse } from 'next/server'
import { getFeaturedProjects, updateFeaturedProjects } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer les projets à la une
export async function GET() {
  try {
    const featuredProjects = await getFeaturedProjects()
    return NextResponse.json({ featuredProjects })

  } catch (error) {
    console.error('Get featured projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Mettre à jour les projets à la une (nécessite authentification)
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/featured called')
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    console.log('Auth header:', authHeader)
    console.log('Token:', token ? 'Present' : 'Missing')

    if (!token || !verifyToken(token)) {
      console.log('Unauthorized request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectIds } = await request.json()
    console.log('Project IDs received:', projectIds)

    if (!Array.isArray(projectIds)) {
      console.log('Invalid projectIds format:', typeof projectIds)
      return NextResponse.json({ error: 'Invalid projectIds format' }, { status: 400 })
    }

    if (projectIds.length > 4) {
      console.log('Too many featured projects:', projectIds.length)
      return NextResponse.json({ error: 'Maximum 4 featured projects allowed' }, { status: 400 })
    }

    console.log('Updating featured projects in database...')
    await updateFeaturedProjects(projectIds)
    console.log('Featured projects updated successfully')

    return NextResponse.json({ success: true, message: 'Featured projects updated successfully' })

  } catch (error) {
    console.error('Update featured projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}