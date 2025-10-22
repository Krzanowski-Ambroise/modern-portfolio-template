import { NextRequest, NextResponse } from 'next/server'
import { updateDocumentFolder, deleteDocumentFolder } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// PUT - Mettre à jour un dossier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = parseInt(params.id)
    const updateData = await request.json()
    const updatedFolder = await updateDocumentFolder(folderId, updateData)

    return NextResponse.json({ 
      success: true, 
      folder: updatedFolder,
      message: 'Dossier mis à jour avec succès'
    })

  } catch (error) {
    console.error('Update document folder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un dossier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = parseInt(params.id)
    await deleteDocumentFolder(folderId)

    return NextResponse.json({ 
      success: true, 
      message: 'Dossier supprimé avec succès'
    })

  } catch (error) {
    console.error('Delete document folder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



