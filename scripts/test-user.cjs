const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function testUser() {
  try {
    console.log('🔄 Test de l\'utilisateur admin...')
    
    const client = await pool.connect()
    
    // Vérifier si l'utilisateur admin existe
    const result = await client.query('SELECT * FROM users WHERE username = $1', ['admin'])
    
    if (result.rows.length === 0) {
      console.log('❌ Utilisateur admin non trouvé')
      
      // Créer l'utilisateur admin
      console.log('🔄 Création de l\'utilisateur admin...')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword])
      console.log('✅ Utilisateur admin créé')
    } else {
      console.log('✅ Utilisateur admin trouvé:', result.rows[0])
      
      // Tester le mot de passe
      const user = result.rows[0]
      const isPasswordValid = bcrypt.compareSync('admin123', user.password)
      console.log('🔐 Test du mot de passe:', isPasswordValid ? '✅ Valide' : '❌ Invalide')
    }
    
    client.release()
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await pool.end()
  }
}

testUser()



