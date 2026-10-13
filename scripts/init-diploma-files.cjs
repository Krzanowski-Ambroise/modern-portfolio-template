const { Pool } = require('pg')
const pgConfig = require('./pg-config.cjs')

const pool = new Pool(pgConfig)

async function initDiplomaFiles() {
  try {
    console.log('🔧 Initialisation de la table diploma_files...')
    
    // Créer la table diploma_files si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diploma_files (
        id SERIAL PRIMARY KEY,
        diploma_id INTEGER REFERENCES diplomas(id) ON DELETE CASCADE,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Table diploma_files créée avec succès!')
    
    // Vérifier si des diplômes existent
    const diplomasResult = await pool.query('SELECT COUNT(*) FROM diplomas')
    console.log(`📊 Nombre de diplômes existants: ${diplomasResult.rows[0].count}`)
    
    // Vérifier si des fichiers de diplômes existent
    const filesResult = await pool.query('SELECT COUNT(*) FROM diploma_files')
    console.log(`📁 Nombre de fichiers de diplômes: ${filesResult.rows[0].count}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
  } finally {
    await pool.end()
  }
}

initDiplomaFiles()



