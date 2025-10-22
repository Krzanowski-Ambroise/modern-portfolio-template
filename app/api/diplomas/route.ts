import { NextRequest, NextResponse } from 'next/server'
import { getAllDiplomas, createDiploma, updateDiploma, deleteDiploma, getDiplomaFiles } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// Fonction pour synchroniser un diplôme spécifique avec les documents
async function syncDiplomaToDocuments(diplomaId: number) {
  const { Pool } = require('pg')
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio',
    password: 'q8a6dEpWMu',
    port: 5432,
  })

  try {
    // Récupérer le diplôme
    const diplomaResult = await pool.query('SELECT * FROM diplomas WHERE id = $1', [diplomaId])
    if (diplomaResult.rows.length === 0) return

    const diploma = diplomaResult.rows[0]
    
    // Récupérer l'ID du dossier "Mes Diplômes"
    const mesDiplomesResult = await pool.query(`
      SELECT id FROM document_folders 
      WHERE name IN ('Mes Diplômes', 'Mes diplômes', 'mes diplômes')
      ORDER BY name
      LIMIT 1
    `)
    
    if (mesDiplomesResult.rows.length === 0) return
    
    const mesDiplomesId = mesDiplomesResult.rows[0].id
    
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
    } else {
      // Créer le dossier
      const createFolderResult = await pool.query(`
        INSERT INTO document_folders (name, parent_id, is_secure, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id
      `, [folderName, mesDiplomesId, false])
      
      folderId = createFolderResult.rows[0].id
    }
    
    // Récupérer tous les fichiers de ce diplôme
    const diplomaFiles = await getDiplomaFiles(diplomaId)
    
    // Pour chaque fichier, créer un document dans le dossier
    for (const file of diplomaFiles) {
      // Vérifier si le document existe déjà
      const existingDocResult = await pool.query(`
        SELECT id FROM documents 
        WHERE filename = $1 AND folder_id = $2
      `, [file.filename, folderId])
      
      if (existingDocResult.rows.length > 0) continue
      
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
        false,
        file.upload_date
      ])
    }
  } finally {
    await pool.end()
  }
}

// GET - Récupérer tous les diplômes
export async function GET(request: NextRequest) {
  try {
    const diplomas = await getAllDiplomas()
    
    return NextResponse.json({ 
      success: true, 
      diplomas 
    })

  } catch (error) {
    console.error('Get diplomas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer un nouveau diplôme
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const diplomaData = await request.json()
    const newDiploma = await createDiploma(diplomaData)

    // Synchroniser automatiquement avec les documents
    try {
      await syncDiplomaToDocuments(newDiploma.id)
    } catch (syncError) {
      console.warn('Auto-sync failed for diploma:', syncError)
    }

    return NextResponse.json({ 
      success: true, 
      diploma: newDiploma,
      message: 'Diplôme ajouté avec succès'
    })

  } catch (error) {
    console.error('Create diploma error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour un diplôme
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const diplomaId = searchParams.get('id')
    
    if (!diplomaId) {
      return NextResponse.json({ error: 'Diploma ID required' }, { status: 400 })
    }

    const diplomaData = await request.json()
    const updatedDiploma = await updateDiploma(parseInt(diplomaId), diplomaData)

    // Synchroniser automatiquement avec les documents
    try {
      await syncDiplomaToDocuments(parseInt(diplomaId))
    } catch (syncError) {
      console.warn('Auto-sync failed for diploma:', syncError)
    }

    return NextResponse.json({ 
      success: true, 
      diploma: updatedDiploma,
      message: 'Diplôme mis à jour avec succès'
    })

  } catch (error) {
    console.error('Update diploma error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un diplôme
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const diplomaId = searchParams.get('id')
    
    if (!diplomaId) {
      return NextResponse.json({ error: 'Diploma ID required' }, { status: 400 })
    }

    await deleteDiploma(parseInt(diplomaId))

    return NextResponse.json({ 
      success: true, 
      message: 'Diplôme supprimé avec succès'
    })

  } catch (error) {
    console.error('Delete diploma error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



