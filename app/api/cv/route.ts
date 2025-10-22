import { NextRequest, NextResponse } from 'next/server'
import { getAllCVFiles, getCurrentCVFile, createCVFile, setCurrentCV, deleteCVFile, createDocument } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// GET - Récupérer tous les CV
export async function GET(request: NextRequest) {
  try {
    const cvFiles = await getAllCVFiles()
    const currentCV = await getCurrentCVFile()
    
    return NextResponse.json({ 
      success: true, 
      cvFiles,
      currentCV
    })

  } catch (error) {
    console.error('Get CV files error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Upload un nouveau CV
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Créer le dossier cv s'il n'existe pas
    const cvDir = join(process.cwd(), 'public', 'cv')
    await mkdir(cvDir, { recursive: true })

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const filename = `cv_${timestamp}.pdf`
    const filePath = join(cvDir, filename)
    const publicPath = `/cv/${filename}`

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Sauvegarder en base de données
    const cvFile = await createCVFile({
      original_name: file.name,
      filename: filename,
      file_path: publicPath,
      file_size: file.size
    })

    // Créer aussi un document dans le dossier "Mes CV" (ID: 2)
    await createDocument({
      name: file.name,
      original_name: file.name,
      filename: filename,
      file_path: publicPath,
      file_size: file.size,
      file_type: file.type,
      folder_id: 2 // Dossier "Mes CV"
    })

    // Définir comme CV actuel
    await setCurrentCV(cvFile.id)

    return NextResponse.json({ 
      success: true, 
      cvFile,
      message: 'CV uploadé avec succès'
    })

  } catch (error) {
    console.error('Upload CV error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Sélectionner un CV comme actuel
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cvId } = await request.json()
    
    if (!cvId) {
      return NextResponse.json({ error: 'CV ID required' }, { status: 400 })
    }

    await setCurrentCV(cvId)

    return NextResponse.json({ 
      success: true, 
      message: 'CV sélectionné avec succès'
    })

  } catch (error) {
    console.error('Set current CV error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Supprimer un CV
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cvId = searchParams.get('id')
    
    if (!cvId) {
      return NextResponse.json({ error: 'CV ID required' }, { status: 400 })
    }

    await deleteCVFile(parseInt(cvId))

    return NextResponse.json({ 
      success: true, 
      message: 'CV supprimé avec succès'
    })

  } catch (error) {
    console.error('Delete CV error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
