import { NextRequest, NextResponse } from 'next/server'
import { deleteDiplomaFile, getDiplomaFileById } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

// DELETE - Supprimer un fichier de diplôme
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`DELETE request for diploma file ${params.id}`)
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      console.log('Unauthorized delete request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = parseInt(params.id)
    if (isNaN(fileId)) {
      console.log('Invalid file ID:', params.id)
      return NextResponse.json({ error: 'Invalid File ID' }, { status: 400 })
    }

    console.log(`Looking for file with ID: ${fileId}`)
    const file = await getDiplomaFileById(fileId)
    if (!file) {
      console.log('File not found in database')
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    console.log('File found:', file)

    // Supprimer le fichier physique
    const filePath = join(process.cwd(), 'public', file.file_path)
    console.log('Deleting physical file:', filePath)
    try {
      await unlink(filePath)
      console.log('Physical file deleted successfully')
    } catch (error) {
      console.warn('File not found on disk:', filePath, error)
    }

    // Supprimer de la base de données
    console.log('Deleting from database...')
    await deleteDiplomaFile(fileId)
    console.log('File deleted from database successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Fichier de diplôme supprimé avec succès'
    })

  } catch (error) {
    console.error('Delete diploma file error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



