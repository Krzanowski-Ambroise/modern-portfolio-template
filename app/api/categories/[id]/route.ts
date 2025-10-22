import { NextRequest, NextResponse } from 'next/server'
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer une catégorie par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const category = await getCategoryById(parseInt(id))

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })

  } catch (error) {
    console.error('Get category by ID error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour une catégorie par ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const categoryData = await request.json()

    if (!categoryData.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

        const updatedCategory = await updateCategory(parseInt(id), categoryData)

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory
    })

  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer une catégorie par ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const success = await deleteCategory(parseInt(id))

    if (!success) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
