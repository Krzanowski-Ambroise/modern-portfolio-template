import { NextRequest, NextResponse } from 'next/server'
import { getProfile, updateProfile } from '@/lib/database-postgres'
import { verifyToken } from '@/lib/auth'

// GET - Récupérer le profil (public)
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/profile - Récupération du profil')
    const profile = await getProfile()
    console.log('Profil récupéré:', profile)
    
    if (!profile) {
      console.log('Aucun profil trouvé, retour des valeurs par défaut')
      // Retourner un profil par défaut si aucun n'existe
      return NextResponse.json({
        success: true,
        profile: {
          name: 'Ambroise Krzanowski',
          title: 'Alternant en cybersécurité avec un back en développement',
          email: 'ambroise.krzanowski@laposte.net',
          phone: '+33 6 44 86 08 82',
          location: 'Béthune, France',
          github: 'https://github.com/Krzanowski-Ambroise',
          linkedin: 'https://www.linkedin.com/in/ambroise-krzanowski/',
          cv_file: '',
          cv_path: ''
        }
      })
    }

    console.log('Profil trouvé, retour des données')
    return NextResponse.json({ 
      success: true, 
      profile 
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData = await request.json()
    console.log('PUT /api/profile - Données reçues:', profileData)
    
    const updatedProfile = await updateProfile(profileData)
    console.log('Profil mis à jour:', updatedProfile)

    return NextResponse.json({ 
      success: true, 
      profile: updatedProfile,
      message: 'Profil mis à jour avec succès'
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
