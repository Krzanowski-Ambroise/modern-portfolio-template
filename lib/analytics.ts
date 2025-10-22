// Système d'analytics pour le portfolio
export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'button_click' | 'download' | 'navigation' | 'time_spent'
  event: string
  data?: any
  timestamp: Date
  session_id: string
  user_agent?: string
  referrer?: string
  page_url: string
}

export interface SessionData {
  session_id: string
  start_time: Date
  last_activity: Date
  page_views: number
  time_spent: number
  events: AnalyticsEvent[]
  user_agent?: string
  referrer?: string
}

// Stockage local des analytics (en production, utiliser une vraie base de données)
let analyticsData: AnalyticsEvent[] = []
let sessions: Map<string, SessionData> = new Map()

export class Analytics {
  private sessionId: string
  private startTime: Date
  private lastActivity: Date

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = new Date()
    this.lastActivity = new Date()
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    const sessionData: SessionData = {
      session_id: this.sessionId,
      start_time: this.startTime,
      last_activity: this.lastActivity,
      page_views: 0,
      time_spent: 0,
      events: [],
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined
    }
    sessions.set(this.sessionId, sessionData)
  }

  // Tracker une vue de page
  trackPageView(page: string) {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'page_view',
      event: 'page_view',
      data: { page },
      timestamp: new Date(),
      session_id: this.sessionId,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : page
    }

    analyticsData.push(event)
    this.updateSession('page_view', event)
  }

  // Tracker un clic sur un bouton
  trackButtonClick(buttonName: string, data?: any) {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'button_click',
      event: 'button_click',
      data: { button: buttonName, ...data },
      timestamp: new Date(),
      session_id: this.sessionId,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    }

    analyticsData.push(event)
    this.updateSession('button_click', event)
  }

  // Tracker un téléchargement
  trackDownload(fileName: string, fileType: string) {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'download',
      event: 'download',
      data: { file_name: fileName, file_type: fileType },
      timestamp: new Date(),
      session_id: this.sessionId,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    }

    analyticsData.push(event)
    this.updateSession('download', event)
  }

  // Tracker le temps passé sur une page
  trackTimeSpent(page: string, timeSpent: number) {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'time_spent',
      event: 'time_spent',
      data: { page, time_spent: timeSpent },
      timestamp: new Date(),
      session_id: this.sessionId,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      page_url: typeof window !== 'undefined' ? window.location.href : page
    }

    analyticsData.push(event)
    this.updateSession('time_spent', event)
  }

  private updateSession(eventType: string, event: AnalyticsEvent) {
    const session = sessions.get(this.sessionId)
    if (session) {
      session.last_activity = new Date()
      session.events.push(event)
      
      if (eventType === 'page_view') {
        session.page_views++
      }
      
      if (eventType === 'time_spent') {
        session.time_spent += event.data?.time_spent || 0
      }
      
      sessions.set(this.sessionId, session)
    }
  }

  // Obtenir les statistiques
  static getStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Filtrer les événements par période
    const events24h = analyticsData.filter(e => e.timestamp >= last24h)
    const events7d = analyticsData.filter(e => e.timestamp >= last7d)
    const events30d = analyticsData.filter(e => e.timestamp >= last30d)

    // Statistiques des sessions
    const activeSessions = Array.from(sessions.values()).filter(s => 
      s.last_activity >= new Date(now.getTime() - 30 * 60 * 1000) // Sessions actives dans les 30 dernières minutes
    )

    // Statistiques des pages
    const pageViews = analyticsData.filter(e => e.type === 'page_view')
    const uniquePages = [...new Set(pageViews.map(e => e.data?.page))]

    // Statistiques des boutons
    const buttonClicks = analyticsData.filter(e => e.type === 'button_click')
    const buttonStats = buttonClicks.reduce((acc, event) => {
      const button = event.data?.button
      acc[button] = (acc[button] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Statistiques des téléchargements
    const downloads = analyticsData.filter(e => e.type === 'download')
    const downloadStats = downloads.reduce((acc, event) => {
      const file = event.data?.file_name
      acc[file] = (acc[file] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Temps moyen passé sur le site
    const timeSpentEvents = analyticsData.filter(e => e.type === 'time_spent')
    const totalTimeSpent = timeSpentEvents.reduce((acc, event) => acc + (event.data?.time_spent || 0), 0)
    const avgTimeSpent = timeSpentEvents.length > 0 ? totalTimeSpent / timeSpentEvents.length : 0

    // Sessions uniques
    const uniqueSessions = new Set(analyticsData.map(e => e.session_id)).size

    return {
      overview: {
        totalEvents: analyticsData.length,
        uniqueSessions,
        activeSessions: activeSessions.length,
        totalPageViews: pageViews.length,
        totalDownloads: downloads.length,
        avgTimeSpent: Math.round(avgTimeSpent / 1000) // en secondes
      },
      periods: {
        last24h: {
          events: events24h.length,
          pageViews: events24h.filter(e => e.type === 'page_view').length,
          uniqueSessions: new Set(events24h.map(e => e.session_id)).size
        },
        last7d: {
          events: events7d.length,
          pageViews: events7d.filter(e => e.type === 'page_view').length,
          uniqueSessions: new Set(events7d.map(e => e.session_id)).size
        },
        last30d: {
          events: events30d.length,
          pageViews: events30d.filter(e => e.type === 'page_view').length,
          uniqueSessions: new Set(events30d.map(e => e.session_id)).size
        }
      },
      pages: {
        uniquePages: uniquePages.length,
        mostVisited: pageViews.reduce((acc, event) => {
          const page = event.data?.page
          acc[page] = (acc[page] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      },
      buttons: buttonStats,
      downloads: downloadStats,
      sessions: Array.from(sessions.values()).map(s => ({
        session_id: s.session_id,
        start_time: s.start_time,
        last_activity: s.last_activity,
        page_views: s.page_views,
        time_spent: s.time_spent,
        events_count: s.events.length
      }))
    }
  }

  // Nettoyer les anciennes données (plus de 30 jours)
  static cleanup() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    analyticsData = analyticsData.filter(e => e.timestamp >= thirtyDaysAgo)
    
    // Nettoyer les sessions inactives
    for (const [sessionId, session] of sessions.entries()) {
      if (session.last_activity < thirtyDaysAgo) {
        sessions.delete(sessionId)
      }
    }
  }
}

// Instance globale
let analyticsInstance: Analytics | null = null

export const getAnalytics = (): Analytics => {
  if (typeof window !== 'undefined' && !analyticsInstance) {
    analyticsInstance = new Analytics()
  }
  return analyticsInstance!
}

// Hook React pour utiliser l'analytics
export const useAnalytics = () => {
  if (typeof window === 'undefined') {
    return {
      trackPageView: () => {},
      trackButtonClick: () => {},
      trackDownload: () => {},
      trackTimeSpent: () => {}
    }
  }

  const analytics = getAnalytics()
  
  return {
    trackPageView: (page: string) => analytics.trackPageView(page),
    trackButtonClick: (buttonName: string, data?: any) => analytics.trackButtonClick(buttonName, data),
    trackDownload: (fileName: string, fileType: string) => analytics.trackDownload(fileName, fileType),
    trackTimeSpent: (page: string, timeSpent: number) => analytics.trackTimeSpent(page, timeSpent)
  }
}



