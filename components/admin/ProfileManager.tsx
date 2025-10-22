'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Upload, 
  Save, 
  X,
  Camera,
  Edit3,
  Download,
  CheckCircle,
  Star,
  GraduationCap,
  Plus,
  Calendar,
  File
} from 'lucide-react'
import { useProfile } from '@/contexts/ProfileContext'
import { useNotifications } from '@/contexts/NotificationContext'

// Fonction utilitaire pour formater la taille des fichiers
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  cv_file?: string
}

interface CVFile {
  id: number
  original_name: string
  filename: string
  file_path: string
  file_size: number
  upload_date: string
  is_current: boolean
}

interface Diploma {
  id: number
  name: string
  institution: string
  obtained_date: string
  document_id: number | null
  created_at: string
  updated_at: string
  document?: any
}

const ProfileManager = () => {
  const { profile: contextProfile, refreshProfile } = useProfile()
  const { addNotification } = useNotifications()
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Ambroise Krzanowski',
    title: 'Alternant en cybersécurité avec un back en développement',
    email: 'ambroise.krzanowski@laposte.net',
    phone: '+33 6 44 86 08 82',
    location: 'Béthune, France',
    github: 'https://github.com/Krzanowski-Ambroise',
    linkedin: 'https://www.linkedin.com/in/ambroise-krzanowski/',
    cv_file: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [cvFiles, setCvFiles] = useState<CVFile[]>([])
  const [currentCV, setCurrentCV] = useState<CVFile | null>(null)
  const [isLoadingCV, setIsLoadingCV] = useState(true)
  const [diplomas, setDiplomas] = useState<Diploma[]>([])
  const [showDiplomaForm, setShowDiplomaForm] = useState(false)
  const [newDiploma, setNewDiploma] = useState({
    name: '',
    institution: '',
    obtained_date: ''
  })
  const [newDiplomaFiles, setNewDiplomaFiles] = useState<File[]>([])
  const [isUploadingDiploma, setIsUploadingDiploma] = useState(false)
  const [diplomaFiles, setDiplomaFiles] = useState<{ [diplomaId: number]: any[] }>({})
  const [uploadingFiles, setUploadingFiles] = useState<{ [diplomaId: number]: boolean }>({})
  const [tempFiles, setTempFiles] = useState<{ [diplomaId: number]: any[] }>({})
  
  // États pour l'édition des diplômes
  const [editingDiploma, setEditingDiploma] = useState<any>(null)
  const [showDiplomaEditForm, setShowDiplomaEditForm] = useState(false)
  const [isUpdatingDiploma, setIsUpdatingDiploma] = useState(false)
  
  // États pour la visualisation des fichiers
  const [viewingDiploma, setViewingDiploma] = useState<any>(null)
  const [showDiplomaFilesModal, setShowDiplomaFilesModal] = useState(false)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  // Charger le profil depuis le contexte
  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile)
      setIsLoading(false)
    }
  }, [contextProfile])

  // Charger les CV depuis l'API
  useEffect(() => {
    const loadCVFiles = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch('/api/cv', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCvFiles(data.cvFiles)
            setCurrentCV(data.currentCV)
          }
        }
      } catch (error) {
        console.error('Error loading CV files:', error)
      } finally {
        setIsLoadingCV(false)
      }
    }

    loadCVFiles()
  }, [])

  // Charger les diplômes
  useEffect(() => {
    const loadDiplomas = async () => {
      try {
        const response = await fetch('/api/diplomas')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDiplomas(data.diplomas)
            // Charger les fichiers pour chaque diplôme
            data.diplomas.forEach((diploma: any) => {
              loadDiplomaFiles(diploma.id)
            })
          }
        }
      } catch (error) {
        console.error('Error loading diplomas:', error)
      }
    }

    loadDiplomas()
  }, [])

  // Charger les fichiers des diplômes quand ils changent
  useEffect(() => {
    diplomas.forEach(diploma => {
      if (!diplomaFiles[diploma.id]) {
        loadDiplomaFiles(diploma.id)
      }
    })
  }, [diplomas])

  const handleSave = async () => {
    try {
      console.log('ProfileManager: Sauvegarde du profil:', profile)
      setIsSaving(true)
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Vous devez être connecté pour sauvegarder')
        return
      }

      console.log('ProfileManager: Envoi de la requête PUT...')
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })

      console.log('ProfileManager: Réponse reçue:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('ProfileManager: Données de réponse:', data)
        if (data.success) {
          setIsEditing(false)
          console.log('ProfileManager: Rafraîchissement du contexte...')
          // Rafraîchir le contexte pour mettre à jour toute l'application
          await refreshProfile()
          addNotification({
            type: 'success',
            title: 'Profil mis à jour avec succès!',
            message: 'Vos informations ont été sauvegardées.'
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur lors de la sauvegarde',
            message: 'Impossible de sauvegarder le profil.'
          })
        }
      } else {
        const errorData = await response.json()
        console.error('ProfileManager: Erreur de sauvegarde:', errorData)
        addNotification({
          type: 'error',
          title: 'Erreur lors de la sauvegarde',
          message: 'Impossible de sauvegarder le profil.'
        })
      }
    } catch (error) {
      console.error('ProfileManager: Erreur lors de la sauvegarde:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la sauvegarde',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés')
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      alert('Le fichier est trop volumineux (max 50MB)')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Vous devez être connecté pour uploader un CV')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          addNotification({
            type: 'success',
            title: 'CV uploadé avec succès!',
            message: 'Votre CV a été téléchargé et est maintenant disponible.'
          })
          // Recharger la liste des CV
          const cvResponse = await fetch('/api/cv', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (cvResponse.ok) {
            const cvData = await cvResponse.json()
            setCvFiles(cvData.cvFiles)
            setCurrentCV(cvData.currentCV)
          }
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur lors de l\'upload',
            message: 'Impossible de télécharger le CV. Veuillez réessayer.'
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Upload error:', errorData)
        addNotification({
          type: 'error',
          title: 'Erreur lors de l\'upload',
          message: 'Impossible de télécharger le CV. Veuillez réessayer.'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de l\'upload',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSelectCV = async (cvId: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Vous devez être connecté')
        return
      }

      const response = await fetch('/api/cv', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cvId })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          addNotification({
            type: 'success',
            title: 'CV sélectionné avec succès!',
            message: 'Ce CV est maintenant votre CV actuel.'
          })
          // Recharger la liste des CV
          const cvResponse = await fetch('/api/cv', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (cvResponse.ok) {
            const cvData = await cvResponse.json()
            setCvFiles(cvData.cvFiles)
            setCurrentCV(cvData.currentCV)
          }
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur lors de la sélection',
            message: 'Impossible de sélectionner ce CV.'
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Select CV error:', errorData)
        addNotification({
          type: 'error',
          title: 'Erreur lors de la sélection',
          message: 'Impossible de sélectionner ce CV.'
        })
      }
    } catch (error) {
      console.error('Select CV error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la sélection',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleDeleteCV = async (cvId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Vous devez être connecté')
        return
      }

      const response = await fetch(`/api/cv?id=${cvId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          addNotification({
            type: 'success',
            title: 'CV supprimé avec succès!',
            message: 'Le CV a été supprimé définitivement.'
          })
          // Recharger la liste des CV
          const cvResponse = await fetch('/api/cv', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (cvResponse.ok) {
            const cvData = await cvResponse.json()
            setCvFiles(cvData.cvFiles)
            setCurrentCV(cvData.currentCV)
          }
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur lors de la suppression',
            message: 'Impossible de supprimer ce CV.'
          })
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la suppression',
          message: 'Impossible de supprimer ce CV.'
        })
      }
    } catch (error) {
      console.error('Delete CV error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la suppression',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateDiploma = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploadingDiploma(true)
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Vous devez être connecté pour ajouter un diplôme.'
        })
        return
      }

      // 1. Créer le diplôme
      const response = await fetch('/api/diplomas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newDiploma,
          obtained_date: new Date(newDiploma.obtained_date)
        })
      })

      if (!response.ok) {
        addNotification({
          type: 'error',
          title: 'Erreur lors de l\'ajout',
          message: 'Impossible d\'ajouter le diplôme.'
        })
        return
      }

      const diplomaData = await response.json()
      const newDiplomaId = diplomaData.diploma.id

      // 2. Upload des fichiers si il y en a
      if (newDiplomaFiles.length > 0) {
        console.log(`Uploading ${newDiplomaFiles.length} files for new diploma ${newDiplomaId}`)
        const formData = new FormData()
        newDiplomaFiles.forEach(file => {
          formData.append('files', file)
        })

        const filesResponse = await fetch(`/api/diplomas/${newDiplomaId}/files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        console.log(`Files upload response status: ${filesResponse.status}`)
        if (!filesResponse.ok) {
          const errorData = await filesResponse.json()
          console.error('Files upload error:', errorData)
          addNotification({
            type: 'warning',
            title: 'Diplôme créé mais erreur fichiers',
            message: 'Le diplôme a été créé mais les fichiers n\'ont pas pu être uploadés.'
          })
        } else {
          const filesData = await filesResponse.json()
          console.log('Files upload success:', filesData)
          addNotification({
            type: 'success',
            title: 'Fichiers uploadés!',
            message: `${newDiplomaFiles.length} fichier(s) ajouté(s) au diplôme.`
          })
        }
      }

      addNotification({
        type: 'success',
        title: 'Diplôme ajouté avec succès!',
        message: `Le diplôme "${newDiploma.name}" a été ajouté${newDiplomaFiles.length > 0 ? ` avec ${newDiplomaFiles.length} fichier(s)` : ''}.`
      })
      
      // Reset form
      setNewDiploma({ name: '', institution: '', obtained_date: '' })
      setNewDiplomaFiles([])
      setShowDiplomaForm(false)
      
      // Recharger les diplômes
      const diplomasResponse = await fetch('/api/diplomas')
      if (diplomasResponse.ok) {
        const data = await diplomasResponse.json()
        if (data.success) {
          setDiplomas(data.diplomas)
          // Charger les fichiers pour chaque diplôme
          data.diplomas.forEach((diploma: any) => {
            loadDiplomaFiles(diploma.id)
          })
        }
      }
    } catch (error) {
      console.error('Create diploma error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de l\'ajout',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setIsUploadingDiploma(false)
    }
  }

  const handleDiplomaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setNewDiplomaFiles(Array.from(files))
    }
  }

  const removeDiplomaFile = (index: number) => {
    setNewDiplomaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteDiploma = async (diplomaId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce diplôme ?')) return

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Vous devez être connecté.'
        })
        return
      }

      const response = await fetch(`/api/diplomas?id=${diplomaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Diplôme supprimé avec succès!',
          message: 'Le diplôme a été supprimé.'
        })
        
        // Recharger les diplômes
        const diplomasResponse = await fetch('/api/diplomas')
        if (diplomasResponse.ok) {
          const data = await diplomasResponse.json()
          if (data.success) {
            setDiplomas(data.diplomas)
          }
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la suppression',
          message: 'Impossible de supprimer le diplôme.'
        })
      }
    } catch (error) {
      console.error('Delete diploma error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la suppression',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  const handleDiplomaFileUpload = async (diplomaId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    console.log(`Uploading ${files.length} files for diploma ${diplomaId}`)
    setUploadingFiles(prev => ({ ...prev, [diplomaId]: true }))

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour uploader des fichiers.'
        })
        return
      }

      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/diplomas/${diplomaId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      console.log(`Upload response status: ${response.status}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`Upload response data:`, data)
        addNotification({
          type: 'success',
          title: 'Fichiers uploadés!',
          message: `${files.length} fichier(s) ajouté(s) au diplôme.`
        })
        
        // Recharger les fichiers du diplôme depuis le serveur
        loadDiplomaFiles(diplomaId)
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de l\'upload',
          message: 'Impossible d\'uploader les fichiers.'
        })
      }
    } catch (error) {
      console.error('Upload diploma files failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de l\'upload',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setUploadingFiles(prev => ({ ...prev, [diplomaId]: false }))
    }
  }

  const loadDiplomaFiles = async (diplomaId: number) => {
    try {
      console.log(`Loading files for diploma ${diplomaId}`)
      const response = await fetch(`/api/diplomas/${diplomaId}/files`)
      console.log(`Response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`Files data for diploma ${diplomaId}:`, data)
        setDiplomaFiles(prev => {
          const newState = { ...prev, [diplomaId]: data.files || [] }
          console.log(`Updated diplomaFiles state:`, newState)
          return newState
        })
        // Nettoyer les fichiers temporaires une fois que les vrais fichiers sont chargés
        setTempFiles(prev => {
          const newState = { ...prev }
          delete newState[diplomaId]
          console.log(`Cleared tempFiles for diploma ${diplomaId}:`, newState)
          return newState
        })
      } else {
        console.log(`API error for diploma ${diplomaId}, initializing empty array`)
        // En cas d'erreur API, on initialise avec un tableau vide
        setDiplomaFiles(prev => ({ ...prev, [diplomaId]: [] }))
      }
    } catch (error) {
      console.error('Error loading diploma files:', error)
      // En cas d'erreur, on initialise avec un tableau vide
      setDiplomaFiles(prev => ({ ...prev, [diplomaId]: [] }))
    }
  }

  const handleDeleteDiplomaFile = async (diplomaId: number, fileId: number) => {
    try {
      console.log(`Deleting file ${fileId} for diploma ${diplomaId}`)
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour supprimer un fichier.'
        })
        return
      }

      const response = await fetch(`/api/diplomas/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log(`Delete response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Delete response data:', data)
        
        addNotification({
          type: 'success',
          title: 'Fichier supprimé!',
          message: 'Le fichier a été supprimé avec succès.'
        })
        
        // Mettre à jour l'état local immédiatement
        setDiplomaFiles(prev => {
          const newState = { ...prev }
          if (newState[diplomaId]) {
            newState[diplomaId] = newState[diplomaId].filter((file: any) => file.id !== fileId)
          }
          console.log('Updated diplomaFiles after deletion:', newState)
          return newState
        })
        
        // Recharger les fichiers depuis le serveur
        loadDiplomaFiles(diplomaId)
      } else {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        addNotification({
          type: 'error',
          title: 'Erreur lors de la suppression',
          message: errorData.error || 'Impossible de supprimer le fichier.'
        })
      }
    } catch (error) {
      console.error('Delete diploma file failed:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la suppression',
        message: 'Une erreur inattendue s\'est produite.'
      })
    }
  }

  // Fonction pour éditer un diplôme
  const handleEditDiploma = (diploma: any) => {
    setEditingDiploma(diploma)
    setShowDiplomaEditForm(true)
  }

  // Fonction pour sauvegarder les modifications d'un diplôme
  const handleUpdateDiploma = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingDiploma(true)
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour modifier un diplôme.'
        })
        return
      }

      const response = await fetch(`/api/diplomas?id=${editingDiploma.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingDiploma.name,
          institution: editingDiploma.institution,
          obtained_date: new Date(editingDiploma.obtained_date)
        })
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Diplôme modifié avec succès!',
          message: `Le diplôme "${editingDiploma.name}" a été mis à jour.`
        })
        
        // Reset form
        setEditingDiploma(null)
        setShowDiplomaEditForm(false)
        
        // Recharger les diplômes
        const diplomasResponse = await fetch('/api/diplomas')
        if (diplomasResponse.ok) {
          const data = await diplomasResponse.json()
          if (data.success) {
            setDiplomas(data.diplomas)
            // Charger les fichiers pour chaque diplôme
            data.diplomas.forEach((diploma: any) => {
              loadDiplomaFiles(diploma.id)
            })
          }
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la modification',
          message: 'Impossible de modifier le diplôme.'
        })
      }
    } catch (error) {
      console.error('Update diploma error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la modification',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setIsUpdatingDiploma(false)
    }
  }

  // Fonction pour visualiser les fichiers d'un diplôme
  const handleViewDiplomaFiles = (diploma: any) => {
    setViewingDiploma(diploma)
    setShowDiplomaFilesModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Mon Profil</h2>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            isEditing 
              ? 'bg-primary-cyan text-white' 
              : 'bg-white/10 text-text-primary hover:bg-white/20'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>
            {isSaving ? 'Sauvegarde...' : isEditing ? 'Sauvegarder' : 'Modifier'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-primary-cyan" />
            <h3 className="text-xl font-bold text-text-primary">Informations personnelles</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Nom complet
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
              ) : (
                <p className="text-text-primary font-medium">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Titre professionnel
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
              ) : (
                <p className="text-text-primary font-medium">{profile.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
              ) : (
                <p className="text-text-primary font-medium">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
              ) : (
                <p className="text-text-primary font-medium">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Localisation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                />
              ) : (
                <p className="text-text-primary font-medium">{profile.location}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Réseaux sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Github className="w-6 h-6 text-primary-violet" />
            <h3 className="text-xl font-bold text-text-primary">Réseaux sociaux</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                GitHub
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                  placeholder="https://github.com/username"
                />
              ) : (
                <a 
                  href={profile.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                >
                  {profile.github}
                </a>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                LinkedIn
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                <a 
                  href={profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                >
                  {profile.linkedin}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gestion des CV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-6 h-6 text-primary-pink" />
              <h3 className="text-xl font-bold text-text-primary">Gestion des CV</h3>
            </div>

        <div className="space-y-6">
          {/* Information sur le système */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-400 font-medium mb-1">Comment ça marche ?</h4>
                <p className="text-text-secondary text-sm">
                  • <strong>Upload</strong> : Téléchargez vos CV (PDF uniquement)<br/>
                  • <strong>Bouton bleu</strong> : Télécharger n'importe quel CV<br/>
                  • <strong>Bouton étoile</strong> : Sélectionner comme CV actuel (visible sur votre site)<br/>
                  • <strong>Bouton rouge</strong> : Supprimer un CV
                </p>
              </div>
            </div>
          </div>

          {/* Upload nouveau CV */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <Camera className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary mb-4">Télécharger un nouveau CV</p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-pink/20 text-primary-pink rounded-lg hover:bg-primary-pink/30 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Choisir un fichier</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Upload en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-primary-pink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Liste des CV */}
          {isLoadingCV ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-cyan"></div>
            </div>
          ) : cvFiles.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-text-primary">Mes CV</h4>
              {cvFiles.map((cv) => (
                <div
                  key={cv.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    cv.is_current 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      cv.is_current ? 'bg-green-500/20' : 'bg-white/10'
                    }`}>
                      <Upload className={`w-4 h-4 ${
                        cv.is_current ? 'text-green-400' : 'text-text-secondary'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium ${
                          cv.is_current ? 'text-green-400' : 'text-text-primary'
                        }`}>
                          {cv.original_name}
                        </p>
                        {cv.is_current && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            CV actuel
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-sm">
                        {formatFileSize(cv.file_size)} • {formatDate(cv.upload_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Bouton télécharger - toujours visible */}
                    <a
                      href="/api/cv/download"
                      download
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Télécharger ce CV"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    
                    {/* Bouton sélectionner - seulement si pas actuel */}
                    {!cv.is_current && (
                      <button
                        onClick={() => handleSelectCV(cv.id)}
                        className="p-2 text-primary-cyan hover:text-primary-cyan/80 hover:bg-primary-cyan/10 rounded-lg transition-colors"
                        title="Sélectionner ce CV comme CV actuel"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Bouton supprimer */}
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer ce CV"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">Aucun CV téléchargé</p>
            </div>
          )}

          <p className="text-xs text-text-secondary">
            Formats acceptés : PDF uniquement. Taille maximale : 50MB.
          </p>
            </div>
          </motion.div>

          {/* Mes Diplômes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-6 h-6 text-primary-violet" />
                <h3 className="text-xl font-bold text-text-primary">Mes Diplômes</h3>
              </div>
              <button
                onClick={() => setShowDiplomaForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-violet/20 text-primary-violet rounded-lg hover:bg-primary-violet/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un diplôme</span>
              </button>
            </div>

            {diplomas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diplomas.map((diploma) => (
                  <div
                    key={diploma.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{diploma.name}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditDiploma(diploma)}
                          className="text-primary-violet hover:text-primary-violet/80 transition-colors"
                          title="Modifier ce diplôme"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewDiplomaFiles(diploma)}
                          className="text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                          title="Voir les documents"
                        >
                          <File className="w-4 h-4" />
                        </button>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleDiplomaFileUpload(diploma.id, e)}
                          className="hidden"
                          id={`diploma-file-${diploma.id}`}
                        />
                        <label
                          htmlFor={`diploma-file-${diploma.id}`}
                          className="text-primary-cyan hover:text-primary-cyan/80 transition-colors cursor-pointer"
                          title="Ajouter des fichiers"
                        >
                          {uploadingFiles[diploma.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-cyan"></div>
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </label>
                        <button
                          onClick={() => handleDeleteDiploma(diploma.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Supprimer ce diplôme"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{diploma.institution}</p>
                    <p className="text-sm text-text-secondary flex items-center space-x-1 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>Obtenu le {new Date(diploma.obtained_date).toLocaleDateString('fr-FR')}</span>
                    </p>
                    
                    {/* Fichiers du diplôme */}
                    <div className="mt-3">
                      {/* Debug: Afficher les données */}
                      {console.log(`Diploma ${diploma.id} files:`, diplomaFiles[diploma.id])}
                      {console.log(`Diploma ${diploma.id} temp files:`, tempFiles[diploma.id])}
                      {(() => {
                        const allFiles = [
                          ...(diplomaFiles[diploma.id] || []),
                          ...(tempFiles[diploma.id] || [])
                        ]
                        return allFiles.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-xs text-text-secondary font-medium">Fichiers associés ({allFiles.length}) :</p>
                            <div className="space-y-1 max-h-20 overflow-y-auto">
                              {allFiles.map((file: any) => (
                                <div key={file.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <File className="w-3 h-3 text-primary-violet flex-shrink-0" />
                                    <span className="text-xs text-text-primary truncate">{file.original_name}</span>
                                    <span className="text-xs text-text-secondary">({formatFileSize(file.file_size)})</span>
                                  </div>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <a
                                      href={file.file_path}
                                      download
                                      className="text-blue-400 hover:text-blue-300 transition-colors"
                                      title="Télécharger"
                                    >
                                      <Download className="w-3 h-3" />
                                    </a>
                                    <button
                                      onClick={() => handleDeleteDiplomaFile(diploma.id, file.id)}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Supprimer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-secondary">Aucun fichier associé</p>
                          <button
                            onClick={() => {
                              const input = document.getElementById(`diploma-file-${diploma.id}`) as HTMLInputElement
                              input?.click()
                            }}
                            className="text-xs text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                          >
                            Ajouter des fichiers
                          </button>
                        </div>
                        )
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">Aucun diplôme ajouté</p>
                <p className="text-text-secondary text-sm">Cliquez sur "Ajouter un diplôme" pour commencer</p>
              </div>
            )}
          </motion.div>

          {/* Formulaire d'ajout de diplôme */}
          {showDiplomaForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-text-primary mb-4">Ajouter un diplôme</h3>
                <form onSubmit={handleCreateDiploma} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Nom du diplôme
                    </label>
                    <input
                      type="text"
                      value={newDiploma.name}
                      onChange={(e) => setNewDiploma({ ...newDiploma, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-violet"
                      placeholder="Ex: Master en Cybersécurité"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={newDiploma.institution}
                      onChange={(e) => setNewDiploma({ ...newDiploma, institution: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-violet"
                      placeholder="Ex: Université de Lille"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Date d'obtention
                    </label>
                    <input
                      type="date"
                      value={newDiploma.obtained_date}
                      onChange={(e) => setNewDiploma({ ...newDiploma, obtained_date: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary focus:outline-none focus:border-primary-violet"
                      required
                    />
                  </div>
                  
                  {/* Section fichiers */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Fichiers associés (optionnel)
                    </label>
                    
                    {/* Sélecteur de fichiers personnalisé */}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDiplomaFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="diploma-file-input"
                      />
                      <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-violet/20 rounded-lg group-hover:bg-primary-violet/30 transition-colors">
                              <Upload className="w-5 h-5 text-primary-violet" />
                            </div>
                            <div>
                              <p className="text-text-primary font-medium">Sélectionner des fichiers</p>
                              <p className="text-xs text-text-secondary">Glissez-déposez ou cliquez pour choisir</p>
                            </div>
                          </div>
                          <div className="text-text-secondary group-hover:text-text-primary transition-colors">
                            <Plus className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-text-secondary mt-2">
                      Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG. Vous pouvez sélectionner plusieurs fichiers.
                    </p>
                    
                    {/* Liste des fichiers sélectionnés */}
                    {newDiplomaFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-text-primary font-medium flex items-center space-x-2">
                          <File className="w-4 h-4 text-primary-violet" />
                          <span>Fichiers sélectionnés ({newDiplomaFiles.length})</span>
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {newDiplomaFiles.map((file, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="p-2 bg-primary-violet/20 rounded-lg">
                                  <File className="w-4 h-4 text-primary-violet" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-text-primary font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDiplomaFile(index)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors ml-2"
                                title="Supprimer ce fichier"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isUploadingDiploma}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-violet text-white rounded-lg hover:bg-primary-violet/90 transition-colors disabled:opacity-50"
                    >
                      {isUploadingDiploma ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isUploadingDiploma ? 'Ajout en cours...' : 'Ajouter'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDiplomaForm(false)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Boutons d'action */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end space-x-4"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 bg-white/10 border border-white/20 text-text-primary rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-violet text-white rounded-xl font-semibold hover:from-primary-cyan/90 hover:to-primary-violet/90 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Sauvegarder les modifications
          </button>
        </motion.div>
      )}

      {/* Modal d'édition de diplôme */}
      {showDiplomaEditForm && editingDiploma && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-text-primary mb-4">Modifier le diplôme</h3>
            <form onSubmit={handleUpdateDiploma} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nom du diplôme
                </label>
                <input
                  type="text"
                  value={editingDiploma.name}
                  onChange={(e) => setEditingDiploma({ ...editingDiploma, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-violet"
                  placeholder="Ex: Master en Cybersécurité"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={editingDiploma.institution}
                  onChange={(e) => setEditingDiploma({ ...editingDiploma, institution: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-violet"
                  placeholder="Ex: Université de Lille"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Date d'obtention
                </label>
                <input
                  type="date"
                  value={editingDiploma.obtained_date}
                  onChange={(e) => setEditingDiploma({ ...editingDiploma, obtained_date: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-text-primary focus:outline-none focus:border-primary-violet"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isUpdatingDiploma}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-violet text-white rounded-lg hover:bg-primary-violet/90 transition-colors disabled:opacity-50"
                >
                  {isUpdatingDiploma ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isUpdatingDiploma ? 'Modification...' : 'Modifier'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDiploma(null)
                    setShowDiplomaEditForm(false)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de visualisation des fichiers */}
      {showDiplomaFilesModal && viewingDiploma && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-primary">
                Fichiers du diplôme: {viewingDiploma.name}
              </h3>
              <button
                onClick={() => {
                  setViewingDiploma(null)
                  setShowDiplomaFilesModal(false)
                }}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {diplomaFiles[viewingDiploma.id] && diplomaFiles[viewingDiploma.id].length > 0 ? (
                <div className="space-y-3">
                  {diplomaFiles[viewingDiploma.id].map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="p-2 bg-primary-violet/20 rounded-lg">
                          <File className="w-5 h-5 text-primary-violet" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary font-medium truncate">{file.original_name}</p>
                          <p className="text-sm text-text-secondary">
                            {formatFileSize(file.file_size)} • {new Date(file.upload_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={file.file_path}
                          download
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            handleDeleteDiplomaFile(viewingDiploma.id, file.id)
                            setShowDiplomaFilesModal(false)
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          title="Supprimer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <File className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">Aucun fichier associé à ce diplôme</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ProfileManager
