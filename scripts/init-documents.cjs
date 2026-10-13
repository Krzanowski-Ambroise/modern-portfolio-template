const { Pool } = require('pg')
const pgConfig = require('./pg-config.cjs')

const pool = new Pool(pgConfig)

async function initDocuments() {
  const client = await pool.connect()
  try {
    console.log('Initialisation des dossiers de documents natifs...')
    
    // Vérifier si les dossiers natifs existent déjà
    const existingFolders = await client.query('SELECT id FROM document_folders WHERE is_native = TRUE')
    
    if (existingFolders.rows.length === 0) {
      // Créer le dossier racine "Mes documents"
      const rootFolder = await client.query(`
        INSERT INTO document_folders (name, description, is_native)
        VALUES ('Mes documents', 'Dossier principal pour tous vos documents professionnels', TRUE)
        RETURNING id
      `)
      
      const rootId = rootFolder.rows[0].id
      console.log('✅ Dossier racine "Mes documents" créé')
      
      // Créer le dossier "Mes CV"
      await client.query(`
        INSERT INTO document_folders (name, description, parent_id, is_native)
        VALUES ('Mes CV', 'Tous vos CV et lettres de motivation', $1, TRUE)
      `, [rootId])
      console.log('✅ Dossier "Mes CV" créé')
      
      // Créer le dossier "Mes diplômes"
      await client.query(`
        INSERT INTO document_folders (name, description, parent_id, is_native)
        VALUES ('Mes diplômes', 'Vos diplômes et certificats', $1, TRUE)
      `, [rootId])
      console.log('✅ Dossier "Mes diplômes" créé')
      
      console.log('🎉 Initialisation des dossiers natifs terminée!')
    } else {
      console.log('ℹ️ Les dossiers natifs existent déjà')
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

initDocuments()



