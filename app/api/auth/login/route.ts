import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/lib/database-postgres'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt:', { username, password: password ? '***' : 'empty' })

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    // Vérifier les identifiants
    const user = await getUserByUsername(username)
    console.log('User found:', user ? { id: user.id, username: user.username } : 'null')
    
    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isPasswordValid = verifyPassword(password, user.password)
    console.log('Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Générer le token
    const token = generateToken(user.id)

    return NextResponse.json({ 
      success: true, 
      token,
      user: { id: user.id, username: user.username }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
