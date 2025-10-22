export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  database: {
    path: process.env.DATABASE_PATH || './database.sqlite'
  }
}


