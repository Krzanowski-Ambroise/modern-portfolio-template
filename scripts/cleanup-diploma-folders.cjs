const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function cleanupDiplomaFolders() {
  try {
    console.log('🧹 Nettoyage des dossiers de diplômes mal placés...')
    
    // Supprimer les dossiers de diplômes qui sont dans "Mes Documents" (parent_id = 1)
    const result = await pool.query(`
      DELETE FROM document_folders 
      WHERE name LIKE '% - %' AND parent_id = 1
    `)
    
    console.log(`✅ ${result.rowCount} dossier(s) de diplôme(s) supprimé(s) de "Mes Documents"`)
    
    // Afficher les dossiers restants
    const remainingFolders = await pool.query(`
      SELECT id, name, parent_id FROM document_folders 
      WHERE name LIKE '% - %'
      ORDER BY id
    `)
    
    console.log('\n📁 Dossiers de diplômes restants:')
    remainingFolders.rows.forEach(folder => {
      console.log(`  - ID: ${folder.id}, Nom: "${folder.name}", Parent: ${folder.parent_id}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  } finally {
    await pool.end()
  }
}

cleanupDiplomaFolders()
