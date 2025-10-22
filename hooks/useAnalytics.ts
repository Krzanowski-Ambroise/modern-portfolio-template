'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/lib/analytics'

export const usePageAnalytics = (pageName: string) => {
  const analytics = useAnalytics()
  const startTime = useRef<number>(Date.now())
  const hasTracked = useRef<boolean>(false)

  useEffect(() => {
    // Tracker la vue de page
    if (!hasTracked.current) {
      analytics.trackPageView(pageName)
      hasTracked.current = true
    }

    // Tracker le temps passé sur la page
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current
      analytics.trackTimeSpent(pageName, timeSpent)
    }

    // Tracker le temps passé toutes les 30 secondes
    const interval = setInterval(() => {
      const timeSpent = Date.now() - startTime.current
      analytics.trackTimeSpent(pageName, timeSpent)
    }, 30000)

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // Tracker le temps final
      const timeSpent = Date.now() - startTime.current
      analytics.trackTimeSpent(pageName, timeSpent)
    }
  }, [pageName, analytics])

  return analytics
}

export const useButtonTracking = (buttonName: string) => {
  const analytics = useAnalytics()

  const trackClick = (additionalData?: any) => {
    analytics.trackButtonClick(buttonName, additionalData)
  }

  return trackClick
}

export const useDownloadTracking = (fileName: string, fileType: string = 'pdf') => {
  const analytics = useAnalytics()

  const trackDownload = () => {
    analytics.trackDownload(fileName, fileType)
  }

  return trackDownload
}



