import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    return NextResponse.json({ success: true, decoded })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}