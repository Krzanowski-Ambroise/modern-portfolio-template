const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function fixProfileTable() {
  const client = await pool.connect()
  try {
    console.log('🔧 Ajout de la colonne current_cv_id à la table profile...')
    
    // Vérifier si la colonne existe déjà
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profile' AND column_name = 'current_cv_id'
    `)
    
    if (checkColumn.rows.length === 0) {
      // Ajouter la colonne current_cv_id
      await client.query(`
        ALTER TABLE profile 
        ADD COLUMN current_cv_id INTEGER
      `)
      console.log('✅ Colonne current_cv_id ajoutée avec succès')
    } else {
      console.log('ℹ️ La colonne current_cv_id existe déjà')
    }
    
    console.log('✅ Table profile mise à jour avec succès')
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

fixProfileTable()



