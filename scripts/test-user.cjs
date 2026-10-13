const { Pool } = require('pg')
const pgConfig = require('./pg-config.cjs')
const bcrypt = require('bcryptjs')

// Configuration de la base de données PostgreSQL
const pool = new Pool(pgConfig)

async function testUser() {
  try {
    console.log('🔄 Test de l\'utilisateur admin...')

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      console.log('❌ ADMIN_PASSWORD non défini (voir .env.example)')
      return
    }

    const client = await pool.connect()
    
    // Vérifier si l'utilisateur admin existe
    const result = await client.query('SELECT * FROM users WHERE username = $1', ['admin'])
    
    if (result.rows.length === 0) {
      console.log('❌ Utilisateur admin non trouvé')
      
      // Créer l'utilisateur admin
      console.log('🔄 Création de l\'utilisateur admin...')
      const hashedPassword = bcrypt.hashSync(adminPassword, 10)
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword])
      console.log('✅ Utilisateur admin créé')
    } else {
      console.log('✅ Utilisateur admin trouvé:', result.rows[0])
      
      // Tester le mot de passe
      const user = result.rows[0]
      const isPasswordValid = bcrypt.compareSync(adminPassword, user.password)
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



