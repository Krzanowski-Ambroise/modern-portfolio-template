import { NextRequest, NextResponse } from 'next/server'
import { getAllTechnologies, createTechnology } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const technologies = await getAllTechnologies()
    return NextResponse.json({ technologies })

  } catch (error) {
    console.error('Get technologies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/technologies called')
    
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', authHeader)
    
    const token = authHeader?.split(' ')[1]
    console.log('Token extracted:', token ? 'Present' : 'Missing')

    if (!token) {
      console.log('No token provided')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const tokenValid = verifyToken(token)
    console.log('Token valid:', tokenValid)
    
    if (!tokenValid) {
      console.log('Invalid token')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { name, category } = await request.json()
    console.log('Request body:', { name, category })

    if (!name) {
      console.log('Name is required')
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    console.log('Creating technology in database...')
    const newTechnology = await createTechnology(name, category || 'Autre')
    console.log('Technology created:', newTechnology)

    return NextResponse.json({
      success: true,
      technology: newTechnology
    })

  } catch (error) {
    console.error('Create technology error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
