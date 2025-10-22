import { NextRequest, NextResponse } from 'next/server'
import { Analytics } from '@/lib/analytics'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer les statistiques analytics
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Nettoyer les anciennes données
    Analytics.cleanup()

    // Récupérer les statistiques
    const stats = Analytics.getStats()

    return NextResponse.json({ 
      success: true, 
      stats 
    })

  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Ajouter un événement analytics
export async function POST(request: NextRequest) {
  try {
    const { type, event, data, page } = await request.json()

    // Créer une instance analytics
    const analytics = new Analytics()

    // Tracker l'événement selon son type
    switch (type) {
      case 'page_view':
        analytics.trackPageView(page || '/')
        break
      case 'button_click':
        analytics.trackButtonClick(event, data)
        break
      case 'download':
        analytics.trackDownload(data?.file_name || 'unknown', data?.file_type || 'unknown')
        break
      case 'time_spent':
        analytics.trackTimeSpent(page || '/', data?.time_spent || 0)
        break
      default:
        return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event tracked successfully' 
    })

  } catch (error) {
    console.error('Track analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



