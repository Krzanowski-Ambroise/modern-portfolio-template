import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getAllDiplomas, getDiplomaFiles } from '@/lib/database-postgres'

// POST - Synchroniser les diplômes avec les documents
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer tous les diplômes
    const diplomas = await getAllDiplomas()
    console.log(`📊 ${diplomas.length} diplôme(s) trouvé(s)`)

    // Récupérer l'ID du dossier "Mes Documents"
    const { Pool } = require('pg')
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'portfolio',
      password: 'q8a6dEpWMu',
      port: 5432,
    })

    const mesDiplomesResult = await pool.query(`
      SELECT id FROM document_folders 
      WHERE name IN ('Mes Diplômes', 'Mes diplômes', 'mes diplômes')
      ORDER BY name
      LIMIT 1
    `)
    
    if (mesDiplomesResult.rows.length === 0) {
      await pool.end()
      return NextResponse.json({ error: 'Dossier "Mes Diplômes" non trouvé' }, { status: 404 })
    }
    
    const mesDiplomesId = mesDiplomesResult.rows[0].id
    console.log(`📁 Dossier "Mes Diplômes" trouvé (ID: ${mesDiplomesId})`)

    let syncedFolders = 0

    for (const diploma of diplomas) {
      console.log(`\n🎓 Traitement du diplôme: ${diploma.name}`)
      
      // Créer le nom du dossier (titre + date)
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
        syncedFolders++
      }
      
      // Récupérer tous les fichiers de ce diplôme
      const diplomaFiles = await getDiplomaFiles(diploma.id)
      console.log(`📄 ${diplomaFiles.length} fichier(s) trouvé(s) pour ce diplôme`)
      
      // Pour chaque fichier, créer un document dans le dossier
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

    await pool.end()
    
    return NextResponse.json({ 
      success: true, 
      syncedFolders,
      message: `Synchronisation terminée: ${syncedFolders} dossier(s) créé(s)`
    })

  } catch (error) {
    console.error('Sync diplomas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
