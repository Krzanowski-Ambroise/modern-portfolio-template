import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, createCategory } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const categories = await getAllCategories()
    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

        const newCategory = await createCategory({ name, description })

    return NextResponse.json({
      success: true,
      category: newCategory
    })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
