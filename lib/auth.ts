import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Secret de signature des tokens, lu depuis l'environnement (voir .env.example)
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return secret
}

export interface User {
  id: number
  username: string
  password: string
  created_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '24h' })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: number }
  } catch {
    return null
  }
}



