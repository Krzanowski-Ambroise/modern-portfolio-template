import { NextRequest, NextResponse } from 'next/server'
import { getDiplomaFiles, createDiplomaFile } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// GET - Récupérer les fichiers d'un diplôme
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const diplomaId = parseInt(params.id)
    if (isNaN(diplomaId)) {
      return NextResponse.json({ error: 'Invalid Diploma ID' }, { status: 400 })
    }

    const files = await getDiplomaFiles(diplomaId)
    
    return NextResponse.json({ 
      success: true, 
      files 
    })

  } catch (error) {
    console.error('Get diploma files error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Upload des fichiers pour un diplôme
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const diplomaId = parseInt(params.id)
    if (isNaN(diplomaId)) {
      return NextResponse.json({ error: 'Invalid Diploma ID' }, { status: 400 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Créer le dossier diplomas s'il n'existe pas
    const diplomasDir = join(process.cwd(), 'public', 'diplomas')
    await mkdir(diplomasDir, { recursive: true })

    const uploadedFiles = []
    for (const file of files) {
      // Générer un nom de fichier unique
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const filename = `diploma_${diplomaId}_${timestamp}.${fileExtension}`
      const filePath = join(diplomasDir, filename)
      const publicPath = `/diplomas/${filename}`

      // Sauvegarder le fichier
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Sauvegarder en base de données
      const diplomaFile = await createDiplomaFile({
        diploma_id: diplomaId,
        original_name: file.name,
        filename: filename,
        file_path: publicPath,
        file_size: file.size,
        file_type: file.type
      })

      uploadedFiles.push(diplomaFile)
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: 'Fichiers uploadés avec succès'
    })

  } catch (error) {
    console.error('Upload diploma files error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}