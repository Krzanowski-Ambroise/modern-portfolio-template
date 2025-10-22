'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  cv_file: string
  cv_path: string
}

interface ProfileContextType {
  profile: ProfileData | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

interface ProfileProviderProps {
  children: ReactNode
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = async () => {
    try {
      console.log('ProfileContext: Chargement du profil...')
      // Essayer de récupérer le profil depuis l'API
      const response = await fetch('/api/profile')
      console.log('ProfileContext: Réponse API:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('ProfileContext: Données reçues:', data)
        if (data.success && data.profile) {
          console.log('ProfileContext: Profil trouvé, mise à jour du contexte')
          setProfile(data.profile)
          return
        }
      }
      
      console.log('ProfileContext: Aucun profil trouvé, utilisation des valeurs par défaut')
      // Si pas de profil en base, utiliser les valeurs par défaut
      setProfile({
        name: 'Ambroise Krzanowski',
        title: 'Alternant en cybersécurité avec un back en développement',
        email: 'ambroise.krzanowski@laposte.net',
        phone: '+33 6 44 86 08 82',
        location: 'Béthune, France',
        github: 'https://github.com/Krzanowski-Ambroise',
        linkedin: 'https://www.linkedin.com/in/ambroise-krzanowski/',
        cv_file: '',
        cv_path: ''
      })
    } catch (error) {
      console.error('ProfileContext: Erreur lors du chargement:', error)
      // En cas d'erreur, utiliser les valeurs par défaut
      setProfile({
        name: 'Ambroise Krzanowski',
        title: 'Alternant en cybersécurité avec un back en développement',
        email: 'ambroise.krzanowski@laposte.net',
        phone: '+33 6 44 86 08 82',
        location: 'Béthune, France',
        github: 'https://github.com/Krzanowski-Ambroise',
        linkedin: 'https://www.linkedin.com/in/ambroise-krzanowski/',
        cv_file: '',
        cv_path: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    console.log('ProfileContext: Rafraîchissement du profil...')
    setIsLoading(true)
    await loadProfile()
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, isLoading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}
