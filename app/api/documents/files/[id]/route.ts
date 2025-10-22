import { NextRequest, NextResponse } from 'next/server'
import { updateDocument, deleteDocument } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// PUT - Mettre à jour un document
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

    const documentId = parseInt(params.id)
    const updateData = await request.json()
    const updatedDocument = await updateDocument(documentId, updateData)

    return NextResponse.json({ 
      success: true, 
      document: updatedDocument,
      message: 'Document mis à jour avec succès'
    })

  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un document
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

    const documentId = parseInt(params.id)
    await deleteDocument(documentId)

    return NextResponse.json({ 
      success: true, 
      message: 'Document supprimé avec succès'
    })

  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



