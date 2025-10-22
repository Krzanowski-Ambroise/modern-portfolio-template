import { NextRequest, NextResponse } from 'next/server'
import { getCurrentCVFile } from '@/lib/database-postgres'
import { readFile } from 'fs/promises'
import { join } from 'path'

// GET - Télécharger le CV actuel
export async function GET(request: NextRequest) {
  try {
    const currentCV = await getCurrentCVFile()
    
    if (!currentCV) {
      return NextResponse.json({ error: 'No CV found' }, { status: 404 })
    }

    const filePath = join(process.cwd(), 'public', 'cv', currentCV.filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${currentCV.original_name}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (error) {
      console.error('File not found:', filePath)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Download CV error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



