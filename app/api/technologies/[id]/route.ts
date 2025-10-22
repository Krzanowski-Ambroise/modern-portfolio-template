import { NextRequest, NextResponse } from 'next/server'
import { getTechnologyById, updateTechnology, deleteTechnology } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer une technologie par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const technology = await getTechnologyById(parseInt(id))

    if (!technology) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 })
    }

    return NextResponse.json({ technology })

  } catch (error) {
    console.error('Get technology by ID error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour une technologie par ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const technologyData = await request.json()

    if (!technologyData.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

        const updatedTechnology = await updateTechnology(parseInt(id), technologyData)

    if (!updatedTechnology) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      technology: updatedTechnology
    })

  } catch (error) {
    console.error('Update technology error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer une technologie par ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const success = await deleteTechnology(parseInt(id))

    if (!success) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete technology error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
