import { NextRequest, NextResponse } from 'next/server'
import { getAllDocumentFolders, createDocumentFolder, deleteDocumentFolder, updateDocumentFolder } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer tous les dossiers
export async function GET(request: NextRequest) {
  try {
    const folders = await getAllDocumentFolders()
    
    return NextResponse.json({ 
      success: true, 
      folders 
    })

  } catch (error) {
    console.error('Get document folders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Créer un nouveau dossier
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderData = await request.json()
    const newFolder = await createDocumentFolder(folderData)

    return NextResponse.json({ 
      success: true, 
      folder: newFolder,
      message: 'Dossier créé avec succès'
    })

  } catch (error) {
    console.error('Create document folder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

