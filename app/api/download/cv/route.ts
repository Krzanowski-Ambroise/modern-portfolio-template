import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { Analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'public', 'downloads', 'cv_ambroise_krzanowski.pdf')
    
    // Lire le fichier
    const fileBuffer = await readFile(filePath)
    
    // Créer les headers pour le téléchargement
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', 'attachment; filename="CV_Ambroise_Krzanowski.pdf"')
    headers.set('Content-Length', fileBuffer.length.toString())
    
    // Tracker le téléchargement
    try {
      const analytics = new Analytics()
      analytics.trackDownload('CV_Ambroise_Krzanowski.pdf', 'pdf')
      console.log('CV download tracked at:', new Date().toISOString())
    } catch (error) {
      console.log('Analytics tracking failed:', error)
    }
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    })
    
  } catch (error) {
    console.error('Download CV error:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
