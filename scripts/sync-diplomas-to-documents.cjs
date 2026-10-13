const { Pool } = require('pg')
const pgConfig = require('./pg-config.cjs')
const fs = require('fs').promises
const path = require('path')

const pool = new Pool(pgConfig)

async function syncDiplomasToDocuments() {
  try {
    console.log('🔄 Synchronisation des diplômes avec le gestionnaire de documents...')
    
    // 1. Récupérer tous les diplômes
    const diplomasResult = await pool.query(`
      SELECT d.*, df.name as folder_name
      FROM diplomas d
      LEFT JOIN document_folders df ON df.name LIKE CONCAT('%', d.name, '%')
      ORDER BY d.obtained_date DESC
    `)
    
    const diplomas = diplomasResult.rows
    console.log(`📊 ${diplomas.length} diplôme(s) trouvé(s)`)
    
    // 2. Récupérer l'ID du dossier "Mes Diplômes" (ID: 7)
    const mesDiplomesResult = await pool.query(`
      SELECT id FROM document_folders 
      WHERE name IN ('Mes Diplômes', 'Mes diplômes', 'mes diplômes')
      ORDER BY name
      LIMIT 1
    `)
    
    if (mesDiplomesResult.rows.length === 0) {
      console.log('❌ Dossier "Mes Diplômes" non trouvé')
      console.log('📋 Dossiers existants:')
      const allFolders = await pool.query('SELECT id, name, parent_id FROM document_folders ORDER BY id')
      allFolders.rows.forEach(folder => {
        console.log(`  - ID: ${folder.id}, Nom: "${folder.name}", Parent: ${folder.parent_id}`)
      })
      return
    }
    
    const mesDiplomesId = mesDiplomesResult.rows[0].id
    console.log(`📁 Dossier "Mes Diplômes" trouvé (ID: ${mesDiplomesId})`)
    
    for (const diploma of diplomas) {
      console.log(`\n🎓 Traitement du diplôme: ${diploma.name}`)
      
      // 3. Créer le nom du dossier (titre + date)
      const date = new Date(diploma.obtained_date).toLocaleDateString('fr-FR')
      const folderName = `${diploma.name} - ${date}`
      
      // Vérifier si le dossier existe déjà
      const existingFolderResult = await pool.query(`
        SELECT id FROM document_folders 
        WHERE name = $1 AND parent_id = $2
      `, [folderName, mesDiplomesId])
      
      let folderId
      if (existingFolderResult.rows.length > 0) {
        folderId = existingFolderResult.rows[0].id
        console.log(`📁 Dossier existant trouvé: ${folderName} (ID: ${folderId})`)
      } else {
        // Créer le dossier
        const createFolderResult = await pool.query(`
          INSERT INTO document_folders (name, parent_id, is_secure, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          RETURNING id
        `, [folderName, mesDiplomesId, false])
        
        folderId = createFolderResult.rows[0].id
        console.log(`✅ Dossier créé: ${folderName} (ID: ${folderId})`)
      }
      
      // 4. Récupérer tous les fichiers de ce diplôme
      const filesResult = await pool.query(`
        SELECT * FROM diploma_files WHERE diploma_id = $1
      `, [diploma.id])
      
      const diplomaFiles = filesResult.rows
      console.log(`📄 ${diplomaFiles.length} fichier(s) trouvé(s) pour ce diplôme`)
      
      // 5. Pour chaque fichier, créer un document dans le dossier
      for (const file of diplomaFiles) {
        // Vérifier si le document existe déjà
        const existingDocResult = await pool.query(`
          SELECT id FROM documents 
          WHERE filename = $1 AND folder_id = $2
        `, [file.filename, folderId])
        
        if (existingDocResult.rows.length > 0) {
          console.log(`  📄 Fichier déjà synchronisé: ${file.original_name}`)
          continue
        }
        
        // Créer le document
        await pool.query(`
          INSERT INTO documents (
            name, original_name, filename, file_path, 
            file_size, file_type, folder_id, is_protected, 
            upload_date, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [
          file.original_name,
          file.original_name,
          file.filename,
          file.file_path,
          file.file_size,
          file.file_type,
          folderId,
          false, // Pas protégé par défaut
          file.upload_date
        ])
        
        console.log(`  ✅ Fichier synchronisé: ${file.original_name}`)
      }
    }
    
    console.log('\n🎉 Synchronisation terminée avec succès!')
    
    // Afficher un résumé
    const summaryResult = await pool.query(`
      SELECT 
        df.name as folder_name,
        COUNT(d.id) as file_count
      FROM document_folders df
      LEFT JOIN documents d ON df.id = d.folder_id
      WHERE df.parent_id = $1 AND df.name LIKE '% - %'
      GROUP BY df.id, df.name
      ORDER BY df.name
    `, [mesDiplomesId])
    
    console.log('\n📊 Résumé des dossiers de diplômes:')
    for (const row of summaryResult.rows) {
      console.log(`  📁 ${row.folder_name}: ${row.file_count} fichier(s)`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error)
  } finally {
    await pool.end()
  }
}

syncDiplomasToDocuments()
