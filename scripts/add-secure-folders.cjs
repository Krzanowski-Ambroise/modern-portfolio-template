const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function addSecureFolders() {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Ajout de la colonne is_secure...')
    
    // Ajouter la colonne is_secure si elle n'existe pas
    await client.query(`
      ALTER TABLE document_folders 
      ADD COLUMN IF NOT EXISTS is_secure BOOLEAN DEFAULT FALSE
    `)
    
    console.log('✅ Colonne is_secure ajoutée')
    
    // Vérifier si les dossiers sécurisés existent déjà
    const existingFolders = await client.query(`
      SELECT id, name FROM document_folders 
      WHERE name IN ('Mes CV', 'Mes Diplômes')
    `)
    
    console.log('📁 Dossiers existants:', existingFolders.rows)
    
    // Créer le dossier "Mes CV" s'il n'existe pas
    const mesCV = existingFolders.rows.find(f => f.name === 'Mes CV')
    if (!mesCV) {
      console.log('📄 Création du dossier "Mes CV"...')
      await client.query(`
        INSERT INTO document_folders (name, description, is_native, is_secure)
        VALUES ('Mes CV', 'Dossier sécurisé pour les CV', true, true)
      `)
      console.log('✅ Dossier "Mes CV" créé')
    } else {
      console.log('📄 Dossier "Mes CV" existe déjà (ID:', mesCV.id, ')')
    }
    
    // Créer le dossier "Mes Diplômes" s'il n'existe pas
    const mesDiplomes = existingFolders.rows.find(f => f.name === 'Mes Diplômes')
    if (!mesDiplomes) {
      console.log('🎓 Création du dossier "Mes Diplômes"...')
      await client.query(`
        INSERT INTO document_folders (name, description, is_native, is_secure)
        VALUES ('Mes Diplômes', 'Dossier sécurisé pour les diplômes', true, true)
      `)
      console.log('✅ Dossier "Mes Diplômes" créé')
    } else {
      console.log('🎓 Dossier "Mes Diplômes" existe déjà (ID:', mesDiplomes.id, ')')
    }
    
    // Afficher tous les dossiers
    const allFolders = await client.query(`
      SELECT id, name, is_native, is_secure FROM document_folders 
      ORDER BY is_secure DESC, name ASC
    `)
    
    console.log('📂 Tous les dossiers:')
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

addSecureFolders()



