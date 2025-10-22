import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments, getDocumentsByFolder, createDocument, deleteDocument, updateDocument } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// GET - Récupérer tous les documents ou par dossier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')
    
    let documents
    if (folderId) {
      documents = await getDocumentsByFolder(parseInt(folderId))
    } else if (folderId === '') {
      // Cas spécial pour la racine : récupérer les documents avec folder_id = null
      documents = await getDocumentsByFolder(null)
    } else {
      documents = await getAllDocuments()
    }
    
    return NextResponse.json({ 
      success: true, 
      documents 
    })

  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Upload un nouveau document
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string
    const isProtected = formData.get('isProtected') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // folderId peut être null pour les fichiers à la racine
    const parsedFolderId = folderId ? parseInt(folderId) : null

    // Créer le dossier mes-documents s'il n'existe pas
    const documentsDir = join(process.cwd(), 'public', 'mes-documents')
    await mkdir(documentsDir, { recursive: true })

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `doc_${timestamp}.${fileExtension}`
    const filePath = join(documentsDir, filename)
    const publicPath = `/mes-documents/${filename}`

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Sauvegarder en base de données
    const document = await createDocument({
      name: file.name,
      original_name: file.name,
      filename: filename,
      file_path: publicPath,
      file_size: file.size,
      file_type: file.type,
      folder_id: parsedFolderId,
      is_protected: isProtected
    })

    return NextResponse.json({ 
      success: true, 
      document,
      message: 'Document uploadé avec succès'
    })

  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

