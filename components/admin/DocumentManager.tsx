'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder, 
  File, 
  Plus, 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit3,
  ArrowLeft,
  FolderPlus,
  Upload,
  ChevronRight,
  Home,
  Lock,
  X,
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Composant pour afficher une carte de dossier
const FolderCard = ({ folder, onNavigate, onContextMenu, onCountFiles, hasAnimationPlayed, markAnimationAsPlayed }: {
  folder: any
  onNavigate: (folderId: number) => void
  onContextMenu: (e: React.MouseEvent, item: any, type: 'folder' | 'document') => void
  onCountFiles: (folderId: number) => Promise<number>
  hasAnimationPlayed: (key: string) => boolean
  markAnimationAsPlayed: (key: string) => void
}) => {
  const [fileCount, setFileCount] = useState<number | null>(null)
  const animationKey = `folder_${folder.id}`

  useEffect(() => {
    onCountFiles(folder.id).then(count => setFileCount(count))
  }, [folder.id, onCountFiles])

  return (
    <motion.div
      initial={hasAnimationPlayed(animationKey) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onAnimationComplete={() => {
        if (!hasAnimationPlayed(animationKey)) {
          markAnimationAsPlayed(animationKey)
        }
      }}
      className="group p-4 rounded-xl transition-all duration-300 cursor-pointer relative bg-white/5 border-white/10 hover:bg-white/10"
      onClick={() => {
        // Les dossiers ne sont pas sélectionnables, ils naviguent
        onNavigate(folder.id)
      }}
      onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <Folder className="w-12 h-12 text-primary-cyan group-hover:text-primary-cyan/80 transition-colors" />
          {folder.is_secure && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400">
              <Lock className="w-3 h-3 text-white font-bold" />
            </div>
          )}
        </div>
        <h4 className="font-medium text-text-primary text-sm mb-1 truncate w-full">
          {folder.name}
        </h4>
        <p className="text-xs text-text-secondary mb-1">
          {formatDate(folder.created_at)}
        </p>
        {fileCount !== null && (
          <p className="text-xs text-primary-cyan font-medium">
            {fileCount} fichier{fileCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onContextMenu(e, folder, 'folder')
          }}
          className="p-1 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Composant pour afficher une carte de document
const DocumentCard = ({ document, onContextMenu, isInCvFolder = false, currentCV = null, hasAnimationPlayed, markAnimationAsPlayed, isSelected, onToggleSelection }: {
  document: any
  onContextMenu: (e: React.MouseEvent, item: any, type: 'folder' | 'document') => void
  isInCvFolder?: boolean
  currentCV?: any
  hasAnimationPlayed: (key: string) => boolean
  markAnimationAsPlayed: (key: string) => void
  isSelected?: boolean
  onToggleSelection?: () => void
}) => {
  // Vérifier si ce document est le CV actuel
  const isCurrentCV = isInCvFolder && currentCV && document.filename === currentCV.filename
  const animationKey = `document_${document.id}`
  
  return (
    <motion.div
      initial={hasAnimationPlayed(animationKey) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onAnimationComplete={() => {
        if (!hasAnimationPlayed(animationKey)) {
          markAnimationAsPlayed(animationKey)
        }
      }}
      className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer relative ${
        isSelected
          ? 'bg-primary-cyan/20 border-primary-cyan/50 scale-105 shadow-lg'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      onClick={() => {
        onToggleSelection?.()
      }}
      onContextMenu={(e) => onContextMenu(e, document, 'document')}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <File className="w-12 h-12 text-primary-violet group-hover:text-primary-violet/80 transition-colors" />
          {document.is_protected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400">
              <Lock className="w-3 h-3 text-white font-bold" />
            </div>
          )}
        </div>
        <h4 className="font-medium text-text-primary text-sm mb-1 truncate w-full">
          {document.original_name}
        </h4>
        <p className="text-xs text-text-secondary mb-1">
          {formatFileSize(document.file_size)}
        </p>
        <p className="text-xs text-text-secondary">
          {formatDate(document.upload_date)}
        </p>
        {isCurrentCV && (
          <p className="text-xs text-green-500 font-medium mt-1">
            CV actuel
          </p>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onContextMenu(e, document, 'document')
          }}
          className="p-1 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}


interface DocumentFolder {
  id: number
  name: string
  description: string | null
  parent_id: number | null
  is_native: boolean
  is_secure: boolean
  created_at: string
  updated_at: string
  children?: DocumentFolder[]
  documents?: Document[]
}

interface Document {
  id: number
  name: string
  original_name: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  folder_id: number
  is_protected: boolean
  upload_date: string
  updated_at: string
}

export default function DocumentManager() {
  const { addNotification } = useNotifications()
  
  // États principaux
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentFolder, setCurrentFolder] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // États pour les formulaires
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderDescription, setNewFolderDescription] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  
  // États pour les menus contextuels
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [contextMenuItem, setContextMenuItem] = useState<any>(null)
  const [contextMenuType, setContextMenuType] = useState<'folder' | 'document' | null>(null)
  
  // États pour les modales
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [modalItem, setModalItem] = useState<any>(null)
  const [modalType, setModalType] = useState<'folder' | 'document' | null>(null)
  const [newName, setNewName] = useState('')
  
  // États pour le drag and drop
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  // États pour la sélection multiple
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [selectionMode, setSelectionMode] = useState(true) // Mode sélection par défaut
  
  // États pour les modales de confirmation
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [showBulkDownloadModal, setShowBulkDownloadModal] = useState(false)

  // Fonction utilitaire pour les notifications asynchrones
  const addNotificationAsync = (notification: any) => {
    setTimeout(() => {
      addNotification(notification)
    }, 0)
  }

  // Fonctions pour la sélection multiple
  const toggleSelection = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    const allIds = new Set<number>()
    folders.forEach(folder => allIds.add(folder.id))
    documents.forEach(doc => allIds.add(doc.id))
    setSelectedItems(allIds)
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }


  // Actions de masse
  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return
    setShowBulkDeleteModal(true)
  }

  const handleBulkDownload = () => {
    if (selectedItems.size === 0) return
    setShowBulkDownloadModal(true)
  }

  const confirmBulkDelete = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      addNotificationAsync({
        type: 'error',
        title: 'Erreur d\'authentification',
        message: 'Vous devez être connecté pour effectuer cette action'
      })
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const itemId of Array.from(selectedItems)) {
      try {
        // Déterminer si c'est un dossier ou un document
        const isFolder = folders.some(f => f.id === itemId)
        const endpoint = isFolder ? `/api/documents/${itemId}` : `/api/documents/files/${itemId}`
        
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        console.error('Error deleting item:', error)
        errorCount++
      }
    }

    // Notifications
    if (successCount > 0) {
      addNotification({
        type: 'success',
        title: 'Suppression en masse',
        message: `${successCount} élément(s) supprimé(s) avec succès`
      })
    }
    if (errorCount > 0) {
      addNotification({
        type: 'error',
        title: 'Erreur de suppression',
        message: `${errorCount} élément(s) n'ont pas pu être supprimé(s)`
      })
    }

    // Invalider tous les caches et recharger les données
    if (currentFolder === null) {
      // À la racine, recharger les dossiers et les documents de la racine
      invalidateCache('folders')
      invalidateCache('documents_root')
      await reloadFolders()
      await reloadCurrentFolderDocuments()
    } else {
      // Dans un dossier, recharger les dossiers et les documents du dossier actuel
      invalidateCache('folders')
      invalidateCache(`documents_${currentFolder}`)
      await reloadFolders()
      await reloadCurrentFolderDocuments()
    }

    clearSelection()
    setShowBulkDeleteModal(false)
  }

  const confirmBulkDownload = async () => {
    // Télécharger tous les documents sélectionnés
    const selectedDocuments = documents.filter(doc => selectedItems.has(doc.id))
    
    selectedDocuments.forEach(doc => {
      const link = document.createElement('a')
      link.href = doc.file_path.startsWith('/') ? doc.file_path : `/${doc.file_path}`
      link.download = doc.original_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })

    addNotification({
      type: 'success',
      title: 'Téléchargement en masse',
      message: `${selectedDocuments.length} fichier(s) en cours de téléchargement`
    })

    clearSelection()
    setShowBulkDownloadModal(false)
  }

  // Fonction utilitaire pour l'upload de fichiers
  const uploadFiles = async (files: FileList, targetFolderId: number) => {
    // Si on est à la racine, on ne met pas de folderId (null)
    const actualFolderId = currentFolder === null ? null : targetFolderId
    const token = localStorage.getItem('adminToken')
    if (!token) {
      addNotificationAsync({
        type: 'error',
        title: 'Erreur d\'authentification',
        message: 'Vous devez être connecté pour uploader des fichiers'
      })
      return
    }

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (actualFolderId !== null) {
          formData.append('folderId', actualFolderId.toString())
        }

        const response = await fetch('/api/documents/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          addNotification({
            type: 'success',
            title: 'Fichier uploadé',
            message: `Le fichier "${file.name}" a été uploadé avec succès`
          })
        } else {
          const errorData = await response.json()
          addNotification({
            type: 'error',
            title: 'Erreur d\'upload',
            message: `Impossible d'uploader "${file.name}": ${errorData.error || 'Erreur inconnue'}`
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        addNotification({
          type: 'error',
          title: 'Erreur d\'upload',
          message: `Erreur lors de l'upload de "${file.name}"`
        })
      }
    }

    // Recharger les données appropriées
    if (currentFolder === null) {
      // À la racine, recharger les dossiers et les documents de la racine
      await reloadFolders()
      await reloadCurrentFolderDocuments()
    } else {
      await reloadCurrentFolderDocuments()
    }
  }
  
  // États pour les CV
  const [cvFiles, setCvFiles] = useState<any[]>([])
  const [loadingCVs, setLoadingCVs] = useState(false)
  const [currentCV, setCurrentCV] = useState<any>(null)
  
  // Cache pour éviter les requêtes inutiles
  const [cache, setCache] = useState<{[key: string]: {data: any, timestamp: number}}>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes en millisecondes
  
  // Cache pour les animations déjà jouées
  const [playedAnimations, setPlayedAnimations] = useState<Set<string>>(new Set())
  
  // Fonctions utilitaires pour le cache
  const getCachedData = (key: string) => {
    const cached = cache[key]
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`📦 Cache hit pour ${key}`)
      return cached.data
    }
    console.log(`📦 Cache miss pour ${key}`)
    return null
  }
  
  const setCachedData = (key: string, data: any) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }))
    console.log(`📦 Données mises en cache pour ${key}`)
  }
  
  const invalidateCache = (pattern?: string) => {
    if (pattern) {
      setCache(prev => {
        const newCache = {...prev}
        Object.keys(newCache).forEach(key => {
          if (key.includes(pattern)) {
            delete newCache[key]
          }
        })
        return newCache
      })
      console.log(`🗑️ Cache invalidé pour le pattern: ${pattern}`)
    } else {
      setCache({})
      console.log(`🗑️ Cache complètement vidé`)
    }
  }
  
  // Fonctions pour gérer les animations
  const hasAnimationPlayed = (key: string) => {
    return playedAnimations.has(key)
  }
  
  const markAnimationAsPlayed = (key: string) => {
    setPlayedAnimations(prev => new Set([...Array.from(prev), key]))
    console.log(`🎬 Animation marquée comme jouée: ${key}`)
  }
  
  const resetAnimations = () => {
    setPlayedAnimations(new Set())
    console.log(`🎬 Toutes les animations ont été réinitialisées`)
  }
  
  // Fonction utilitaire pour faire des requêtes avec retry
  const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 2): Promise<Response | null> => {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options)
        if (response.ok) {
          return response
        }
        if (i === retries) {
          console.warn(`Failed to fetch ${url} after ${retries + 1} attempts:`, response.status)
          return null
        }
        // Attendre un peu avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      } catch (error) {
        if (i === retries) {
          console.warn(`Network error fetching ${url} after ${retries + 1} attempts:`, error)
          return null
        }
        // Attendre un peu avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return null
  }

  // Fonction pour compter récursivement les fichiers dans un dossier
  const countFilesInFolder = async (folderId: number): Promise<number> => {
    try {
      const response = await fetch(`/api/documents/files?folderId=${folderId}`)
      if (!response.ok) {
        console.warn(`Failed to count files for folder ${folderId}:`, response.status)
        return 0
      }

      const data = await response.json()
      let count = data.documents?.length || 0

      // Compter les sous-dossiers récursivement
      const subfolders = folders.filter(f => f.parent_id === folderId)
      for (const subfolder of subfolders) {
        count += await countFilesInFolder(subfolder.id)
      }

      return count
    } catch (error) {
      console.warn('Error counting files (non-critical):', error)
      return 0
    }
  }

  // Charger les données
  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Charger tous les dossiers (avec cache)
      const foldersCacheKey = 'folders'
      const cachedFolders = getCachedData(foldersCacheKey)
      
      if (cachedFolders) {
        setFolders(cachedFolders)
        console.log('📦 Dossiers chargés depuis le cache')
      } else {
        try {
          const foldersRes = await fetch('/api/documents')
          if (foldersRes.ok) {
            const foldersData = await foldersRes.json()
            setFolders(foldersData.folders)
            setCachedData(foldersCacheKey, foldersData.folders)
          } else {
            console.warn('Failed to load folders:', foldersRes.status)
          }
        } catch (error) {
          console.warn('Error loading folders (non-critical):', error)
        }
      }
      
      // Logique spéciale pour le dossier "Mes CV" (ID: 2)
      if (currentFolder === 2) {
        console.log('=== CHARGEMENT DU DOSSIER MES CV (ID: 2) ===')
        
        // Charger le CV actuel (avec cache)
        const cvCacheKey = 'currentCV'
        const cachedCV = getCachedData(cvCacheKey)
        
        if (cachedCV) {
          setCurrentCV(cachedCV)
          console.log('📦 CV actuel chargé depuis le cache')
        } else {
          const cvRes = await fetchWithRetry('/api/cv')
          if (cvRes) {
            try {
              const cvData = await cvRes.json()
              setCurrentCV(cvData.currentCV)
              setCachedData(cvCacheKey, cvData.currentCV)
              console.log('Current CV:', cvData.currentCV)
            } catch (error) {
              console.warn('Error parsing CV data:', error)
            }
          }
        }
        
        // Charger les documents du dossier "Mes CV" (avec cache)
        const documentsCacheKey = `documents_${currentFolder}`
        const cachedDocuments = getCachedData(documentsCacheKey)
        
        if (cachedDocuments) {
          setDocuments(cachedDocuments)
          console.log('📦 Documents chargés depuis le cache')
        } else {
          const documentsRes = await fetchWithRetry(`/api/documents/files?folderId=2`)
          if (documentsRes) {
            try {
              const documentsData = await documentsRes.json()
              console.log('Documents in Mes CV:', documentsData.documents)
              setDocuments(documentsData.documents || [])
              setCachedData(documentsCacheKey, documentsData.documents || [])
            } catch (error) {
              console.warn('Error parsing documents data:', error)
              setDocuments([])
            }
          } else {
            setDocuments([])
          }
        }
        
        // Pas de CV séparés - tout est dans les documents
        setCvFiles([])
        console.log('=== FIN CHARGEMENT MES CV ===')
      } else if (currentFolder !== null) {
        // Charger les documents du dossier courant (avec cache)
        const documentsCacheKey = `documents_${currentFolder}`
        const cachedDocuments = getCachedData(documentsCacheKey)
        
        if (cachedDocuments) {
          setDocuments(cachedDocuments)
          console.log('📦 Documents chargés depuis le cache')
        } else {
          try {
            const documentsRes = await fetch(`/api/documents/files?folderId=${currentFolder}`)
            if (documentsRes.ok) {
              const documentsData = await documentsRes.json()
              setDocuments(documentsData.documents)
              setCachedData(documentsCacheKey, documentsData.documents)
            } else {
              console.warn('Failed to load documents for folder:', currentFolder, documentsRes.status)
              setDocuments([])
            }
          } catch (error) {
            console.warn('Error loading documents for folder (non-critical):', error)
            setDocuments([])
          }
        }
        setCvFiles([]) // Pas de CV dans les autres dossiers
        } else {
          // Dossier racine - charger les fichiers de la racine (sans folderId)
          const documentsCacheKey = 'documents_root'
          const cachedDocuments = getCachedData(documentsCacheKey)
          
          if (cachedDocuments) {
            setDocuments(cachedDocuments)
            console.log('📦 Documents de la racine chargés depuis le cache')
          } else {
            try {
              const documentsRes = await fetch('/api/documents/files?folderId=')
              if (documentsRes.ok) {
                const documentsData = await documentsRes.json()
                setDocuments(documentsData.documents || [])
                setCachedData(documentsCacheKey, documentsData.documents || [])
                console.log('Documents de la racine chargés:', documentsData.documents)
              } else {
                console.warn('Failed to load documents for root:', documentsRes.status)
                setDocuments([])
              }
            } catch (error) {
              console.warn('Error loading documents for root (non-critical):', error)
              setDocuments([])
            }
          }
          setCvFiles([])
        }
    } catch (error) {
      console.error('Error loading data:', error)
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les données.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour recharger seulement les documents du dossier courant
  const reloadCurrentFolderDocuments = async () => {
    try {
      if (currentFolder === null) {
        // À la racine, recharger les fichiers de la racine
        const documentsCacheKey = 'documents_root'
        invalidateCache(documentsCacheKey)
        
        const documentsResponse = await fetchWithRetry('/api/documents/files?folderId=')
        if (documentsResponse) {
          const documentsData = await documentsResponse.json()
          setDocuments(documentsData.documents || [])
          setCachedData(documentsCacheKey, documentsData.documents || [])
        }
      } else {
        // Dans un dossier, recharger les fichiers de ce dossier
        const documentsCacheKey = `documents_${currentFolder}`
        invalidateCache(documentsCacheKey)
        
        const documentsResponse = await fetchWithRetry(`/api/documents/files?folderId=${currentFolder}`)
        if (documentsResponse) {
          const documentsData = await documentsResponse.json()
          setDocuments(documentsData.documents || [])
          setCachedData(documentsCacheKey, documentsData.documents || [])
        }
      }
    } catch (error) {
      console.warn('Error reloading documents:', error)
    }
  }

  // Fonction pour recharger seulement les dossiers
  const reloadFolders = async () => {
    try {
      invalidateCache('folders')
      
      const foldersResponse = await fetchWithRetry('/api/documents')
      if (foldersResponse) {
        const foldersData = await foldersResponse.json()
        setFolders(foldersData.folders || [])
        setCachedData('folders', foldersData.folders || [])
      }
    } catch (error) {
      console.warn('Error reloading folders:', error)
    }
  }

  // Fonction pour synchroniser les diplômes avec les documents
  const syncDiplomasToDocuments = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Token d\'authentification manquant'
        })
        return
      }

      const response = await fetch('/api/documents/sync-diplomas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        addNotification({
          type: 'success',
          title: 'Synchronisation réussie',
          message: `${result.syncedFolders} dossier(s) de diplôme(s) synchronisé(s)`
        })
        
        // Recharger les dossiers pour voir les nouveaux dossiers de diplômes
        await reloadFolders()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'Erreur de synchronisation',
          message: error.error || 'Erreur lors de la synchronisation des diplômes'
        })
      }
    } catch (error) {
      console.error('Error syncing diplomas:', error)
      addNotification({
        type: 'error',
        title: 'Erreur de synchronisation',
        message: 'Erreur lors de la synchronisation des diplômes'
      })
    }
  }

  // Gérer l'upload de fichiers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Si on est à la racine, on utilise le dossier "Mes Documents" (ID: 1) par défaut
    const targetFolder = currentFolder || 1

    await uploadFiles(files, targetFolder)
    
    // Reset l'input file
    event.target.value = ''
  }

  // Gestion du drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    const files = e.dataTransfer.files
    if (files.length === 0) return

    // Si on est à la racine, on utilise le dossier "Mes Documents" (ID: 1) par défaut
    const targetFolder = currentFolder || 1

    await uploadFiles(files, targetFolder)
  }

  // Navigation
  const navigateToFolder = (folderId: number) => {
    setCurrentFolder(folderId)
  }

  const navigateBack = () => {
    const currentFolderData = folders.find(f => f.id === currentFolder)
    if (currentFolderData?.parent_id) {
      setCurrentFolder(currentFolderData.parent_id)
    } else {
      setCurrentFolder(null)
    }
  }

  // Fonction pour construire le breadcrumb
  const getBreadcrumbPath = () => {
    const path = []
    let current = currentFolder
    
    while (current !== null) {
      const folder = folders.find(f => f.id === current)
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name })
        current = folder.parent_id
      } else {
        break
      }
    }
    
    return path
  }

  // Créer un dossier
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour créer un dossier.'
        })
        return
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDescription || null,
          parent_id: currentFolder
        })
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Dossier créé!',
          message: `Le dossier "${newFolderName}" a été créé avec succès.`
        })
        
        // Recharger seulement la liste des dossiers
        await reloadFolders()
        
        setNewFolderName('')
        setNewFolderDescription('')
        setShowFolderForm(false)
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur lors de la création',
          message: 'Impossible de créer le dossier.'
        })
      }
    } catch (error) {
      console.error('Create folder error:', error)
      addNotification({
        type: 'error',
        title: 'Erreur lors de la création',
        message: 'Une erreur inattendue s\'est produite.'
      })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  // Menu contextuel
  const handleContextMenu = (e: React.MouseEvent, item: any, type: 'folder' | 'document') => {
    e.preventDefault()
    e.stopPropagation()
    
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuItem(item)
    setContextMenuType(type)
    setShowContextMenu(true)
  }

  // Fermer le menu contextuel
  const closeContextMenu = () => {
    setShowContextMenu(false)
    setContextMenuItem(null)
    setContextMenuType(null)
  }

  // Télécharger un document
  const handleDownload = async (doc: any) => {
    try {
      console.log('Téléchargement de:', doc)
      
      // Construire l'URL complète du fichier
      const fileUrl = doc.file_path.startsWith('/') ? doc.file_path : `/${doc.file_path}`
      
      // Créer un lien de téléchargement
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = doc.original_name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      addNotification({
        type: 'success',
        title: 'Téléchargement',
        message: `Téléchargement de "${doc.original_name}" démarré`
      })
    } catch (error) {
      console.error('Error downloading file:', error)
      addNotification({
        type: 'error',
        title: 'Erreur de téléchargement',
        message: 'Impossible de télécharger le fichier'
      })
    }
    closeContextMenu()
  }

  // Ouvrir la modale de renommage
  const openRenameModal = (item: any, type: 'folder' | 'document') => {
    setModalItem(item)
    setModalType(type)
    setNewName(item.name)
    setShowRenameModal(true)
    closeContextMenu()
  }

  // Ouvrir la modale de suppression
  const openDeleteModal = (item: any, type: 'folder' | 'document') => {
    setModalItem(item)
    setModalType(type)
    setShowDeleteModal(true)
    closeContextMenu()
  }

  // Confirmer le renommage
  const confirmRename = async () => {
    if (!newName.trim()) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Le nom ne peut pas être vide'
      })
      return
    }

    try {
      const endpoint = modalType === 'folder' ? '/api/documents' : '/api/documents/files'
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour effectuer cette action'
        })
        return
      }
      
      const response = await fetch(`${endpoint}/${modalItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Renommage réussi',
          message: `${modalType === 'folder' ? 'Le dossier' : 'Le document'} a été renommé`
        })
        
        // Recharger seulement les données nécessaires
        if (modalType === 'folder') {
          // Pour un dossier, recharger seulement la liste des dossiers
          await reloadFolders()
        } else {
          // Pour un document, recharger seulement les documents du dossier courant
          await reloadCurrentFolderDocuments()
        }
        
        setShowRenameModal(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du renommage')
      }
    } catch (error) {
      console.error('Error renaming:', error)
      addNotification({
        type: 'error',
        title: 'Erreur de renommage',
        message: 'Impossible de renommer l\'élément'
      })
    }
  }

  // Confirmer la suppression
  const confirmDelete = async () => {
    try {
      const endpoint = modalType === 'folder' ? '/api/documents' : '/api/documents/files'
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        addNotification({
          type: 'error',
          title: 'Erreur d\'authentification',
          message: 'Vous devez être connecté pour effectuer cette action'
        })
        return
      }
      
      const response = await fetch(`${endpoint}/${modalItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Suppression réussie',
          message: `${modalType === 'folder' ? 'Le dossier' : 'Le document'} a été supprimé`
        })
        
        // Recharger seulement les données nécessaires
        if (modalType === 'folder') {
          // Pour un dossier, recharger seulement la liste des dossiers
          await reloadFolders()
        } else {
          // Pour un document, recharger seulement les documents du dossier courant
          await reloadCurrentFolderDocuments()
        }
        
        setShowDeleteModal(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      addNotification({
        type: 'error',
        title: 'Erreur de suppression',
        message: 'Impossible de supprimer l\'élément'
      })
    }
  }

  // Gérer les clics en dehors du menu
  useEffect(() => {
    if (showContextMenu) {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as Element).closest('.context-menu')) {
          closeContextMenu()
        }
      }
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showContextMenu])

  // Charger les données au montage et quand currentFolder change
  useEffect(() => {
    loadData()
  }, [currentFolder])

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-3">
              {/* Bouton de retour discret à gauche du titre */}
              <button
                onClick={currentFolder ? navigateBack : undefined}
                disabled={!currentFolder}
                className={`p-1 transition-colors ${
                  currentFolder 
                    ? 'text-gray-400 hover:text-gray-200 cursor-pointer' 
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <h2 className="text-2xl font-bold text-text-primary">
                {currentFolder ? 
                  folders.find(f => f.id === currentFolder)?.name || 'Dossier' : 
                  'Mes Documents'
                }
              </h2>
            </div>
            
            <p className="text-text-secondary">
              {currentFolder ? 'Gérez les fichiers de ce dossier' : 'Gérez vos documents professionnels'}
            </p>
            
            {/* Breadcrumb toujours visible */}
            <div className="flex items-center space-x-1 text-xs text-text-secondary mt-1">
              <button
                onClick={() => setCurrentFolder(null)}
                className="flex items-center space-x-1 hover:text-primary-cyan transition-colors"
              >
                <Home className="w-3 h-3" />
                <span>Mes Documents</span>
              </button>
              
              {getBreadcrumbPath().map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight className="w-3 h-3 text-text-secondary/50" />
                  <button
                    onClick={() => setCurrentFolder(folder.id)}
                    className="hover:text-primary-cyan transition-colors"
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          
          {/* Barre d'actions pour la sélection multiple - à gauche */}
          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {selectedItems.size} sélectionné(s)
              </span>
              <button
                onClick={handleBulkDownload}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 rounded-lg hover:bg-primary-cyan/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          )}
          
          {/* Bouton Sync Diplômes - à gauche des boutons principaux */}
          {currentFolder === 7 && (
            <button
              onClick={syncDiplomasToDocuments}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-600/30 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Sync Diplômes</span>
            </button>
          )}
          
          {/* Boutons principaux - toujours à droite */}
          <button
            onClick={() => setShowFolderForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 rounded-lg hover:bg-primary-cyan/30 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nouveau dossier</span>
          </button>
          
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-violet/20 text-primary-violet border border-primary-violet/30 rounded-lg hover:bg-primary-violet/30 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload fichier</span>
          </button>
          
          {/* Input file caché */}
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.svg"
          />
        </div>
      </div>

      {/* Contenu principal - Grille style OneDrive */}
      <div 
        className={`flex-1 glass rounded-2xl p-6 transition-all duration-300 relative ${
          isDragOver 
            ? 'border-2 border-dashed border-primary-violet bg-primary-violet/10' 
            : 'border border-white/10'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-violet/20 rounded-2xl z-10">
            <div className="text-center">
              <Upload className="w-16 h-16 text-primary-violet mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-violet mb-2">
                Déposez vos fichiers ici
              </h3>
              <p className="text-primary-violet/80">
                Glissez et déposez vos fichiers dans cette zone
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Dossiers */}
          {folders
            .filter(folder => folder.parent_id === (currentFolder || null))
            .map(folder => (
              <FolderCard 
                key={`folder-${folder.id}`} 
                folder={folder} 
                onNavigate={navigateToFolder}
                onContextMenu={handleContextMenu}
                onCountFiles={countFilesInFolder}
                hasAnimationPlayed={hasAnimationPlayed}
                markAnimationAsPlayed={markAnimationAsPlayed}
              />
            ))}

          {/* Documents - affichage pour tous les dossiers et à la racine */}
          {documents
            .filter(doc => {
              if (currentFolder === null) {
                // À la racine, afficher les fichiers de la racine (sans folder_id ou folder_id null)
                return doc.folder_id === null || doc.folder_id === undefined
              } else {
                // Dans un dossier, afficher les fichiers de ce dossier
                return doc.folder_id === currentFolder
              }
            })
            .map(document => (
              <DocumentCard 
                key={`document-${document.id}`} 
                document={document} 
                onContextMenu={handleContextMenu}
                isInCvFolder={currentFolder === 2}
                currentCV={currentCV}
                hasAnimationPlayed={hasAnimationPlayed}
                markAnimationAsPlayed={markAnimationAsPlayed}
                isSelected={selectedItems.has(document.id)}
                onToggleSelection={() => toggleSelection(document.id)}
              />
            ))}
        </div>


        {/* Message si vide */}
        {folders.filter(f => f.parent_id === (currentFolder || null)).length === 0 && 
         (currentFolder === null ? 
          documents.filter(doc => doc.folder_id === 1).length === 0 : 
          documents.filter(doc => doc.folder_id === currentFolder).length === 0) && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Dossier vide</h3>
            <p className="text-text-secondary mb-4">
              {currentFolder ? 'Ce dossier ne contient aucun élément' : 'Aucun document ou dossier'}
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-text-secondary/60">
              <Upload className="w-4 h-4" />
              <span>Vous pouvez aussi glisser-déposer des fichiers ici</span>
              {!currentFolder && (
                <span className="text-primary-violet/80">(seront ajoutés dans "Mes Documents")</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de création de dossier */}
      {showFolderForm && (
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
            <h3 className="text-xl font-bold text-text-primary mb-4">Nouveau dossier</h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nom du dossier
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
                  placeholder="Nom du dossier"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50"
                  placeholder="Description du dossier"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFolderForm(false)}
                  className="flex-1 px-4 py-2 bg-white/5 text-text-primary border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 rounded-lg hover:bg-primary-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingFolder ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Menu contextuel */}
      {showContextMenu && contextMenuItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[9999] context-menu"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <div className="glass rounded-lg p-2 min-w-[150px]">
            {contextMenuType === 'folder' && (
              <>
                {!contextMenuItem?.is_secure && (
                  <>
                    <button 
                      onClick={() => openRenameModal(contextMenuItem, 'folder')}
                      className="w-full text-left px-3 py-2 text-text-primary hover:bg-white/10 rounded transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Renommer</span>
                    </button>
                    <button 
                      onClick={() => openDeleteModal(contextMenuItem, 'folder')}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </>
                )}
                {contextMenuItem?.is_secure && (
                  <div className="px-3 py-2 text-text-secondary text-sm">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Dossier sécurisé</span>
                    </div>
                    <p className="text-xs mt-1">Les actions sont restreintes</p>
                  </div>
                )}
              </>
            )}
            {contextMenuType === 'document' && (
              <>
                <button 
                  onClick={() => handleDownload(contextMenuItem)}
                  className="w-full text-left px-3 py-2 text-text-primary hover:bg-white/10 rounded transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </button>
                {!contextMenuItem?.is_protected && (
                  <>
                    <button 
                      onClick={() => openRenameModal(contextMenuItem, 'document')}
                      className="w-full text-left px-3 py-2 text-text-primary hover:bg-white/10 rounded transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Renommer</span>
                    </button>
                    <button 
                      onClick={() => openDeleteModal(contextMenuItem, 'document')}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </>
                )}
                {contextMenuItem?.is_protected && (
                  <div className="px-3 py-2 text-text-secondary text-sm">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Document protégé</span>
                    </div>
                    <p className="text-xs mt-1">Seul le téléchargement est autorisé</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Modale de renommage */}
      {showRenameModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setShowRenameModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-background border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Renommer {modalType === 'folder' ? 'le dossier' : 'le document'}
              </h3>
              <button
                onClick={() => setShowRenameModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Nouveau nom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan/50 transition-all duration-300"
                  placeholder="Entrez le nouveau nom..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      confirmRename()
                    } else if (e.key === 'Escape') {
                      setShowRenameModal(false)
                    }
                  }}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmRename}
                  className="px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-primary-cyan/80 transition-colors font-medium"
                >
                  Renommer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modale de suppression */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-background border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Supprimer {modalType === 'folder' ? 'le dossier' : 'le document'}
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-text-secondary leading-relaxed">
                {modalType === 'folder' 
                  ? `Êtes-vous sûr de vouloir supprimer le dossier "${modalItem?.name}" et tout son contenu ?`
                  : `Êtes-vous sûr de vouloir supprimer le document "${modalItem?.name}" ?`
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-text-primary rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de confirmation pour la suppression en masse */}
      {showBulkDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]"
          onClick={() => setShowBulkDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Supprimer {selectedItems.size} élément(s)
                </h3>
              </div>
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-text-secondary mb-6">
              Êtes-vous sûr de vouloir supprimer {selectedItems.size} élément(s) sélectionné(s) ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmBulkDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de confirmation pour le téléchargement en masse */}
      {showBulkDownloadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]"
          onClick={() => setShowBulkDownloadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Download className="w-6 h-6 text-primary-violet" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Télécharger {selectedItems.size} élément(s)
                </h3>
              </div>
              <button
                onClick={() => setShowBulkDownloadModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-text-secondary mb-6">
              Voulez-vous télécharger {selectedItems.size} élément(s) sélectionné(s) ? Seuls les documents seront téléchargés.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBulkDownloadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmBulkDownload}
                className="flex-1 px-4 py-2 bg-primary-violet text-white rounded-lg hover:bg-primary-violet/80 transition-colors"
              >
                Télécharger
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}