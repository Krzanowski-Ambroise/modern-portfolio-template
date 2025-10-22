const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function fixSecureFolders() {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Mise à jour des dossiers sécurisés...')
    
    // Marquer "Mes CV" comme sécurisé
    await client.query(`
      UPDATE document_folders 
      SET is_secure = true 
      WHERE name = 'Mes CV'
    `)
    console.log('✅ Dossier "Mes CV" marqué comme sécurisé')
    
    // Supprimer les doublons (garder seulement les sécurisés)
    const duplicates = await client.query(`
      SELECT name, COUNT(*) as count 
      FROM document_folders 
      WHERE name IN ('Mes CV', 'Mes Diplômes', 'Mes diplômes')
      GROUP BY name 
      HAVING COUNT(*) > 1
    `)
    
    if (duplicates.rows.length > 0) {
      console.log('🧹 Nettoyage des doublons...')
      
      // Supprimer les anciens dossiers non sécurisés
      await client.query(`
        DELETE FROM document_folders 
        WHERE name = 'Mes diplômes' AND is_secure = false
      `)
      console.log('✅ Ancien dossier "Mes diplômes" supprimé')
    }
    
    // Afficher tous les dossiers
    const allFolders = await client.query(`
      SELECT id, name, is_native, is_secure FROM document_folders 
      ORDER BY is_secure DESC, name ASC
    `)
    
    console.log('📂 Dossiers finaux:')
    allFolders.rows.forEach(folder => {
      console.log(`  - ${folder.name} (ID: ${folder.id}, Native: ${folder.is_native}, Secure: ${folder.is_secure})`)
    })
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

fixSecureFolders()



