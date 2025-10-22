'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  Clock, 
  Download, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

interface DashboardStats {
  overview: {
    totalEvents: number
    uniqueSessions: number
    activeSessions: number
    totalPageViews: number
    totalDownloads: number
    avgTimeSpent: number
  }
  periods: {
    last24h: { events: number; pageViews: number; uniqueSessions: number }
    last7d: { events: number; pageViews: number; uniqueSessions: number }
    last30d: { events: number; pageViews: number; uniqueSessions: number }
  }
  pages: {
    uniquePages: number
    mostVisited: Record<string, number>
  }
  buttons: Record<string, number>
  downloads: Record<string, number>
  sessions: Array<{
    session_id: string
    start_time: Date
    last_activity: Date
    page_views: number
    time_spent: number
    events_count: number
  }>
}

const AdvancedDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données
    const loadStats = async () => {
      setIsLoading(true)
      
      // En production, ceci viendrait d'une API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Données simulées pour la démonstration
      const mockStats: DashboardStats = {
        overview: {
          totalEvents: 1247,
          uniqueSessions: 89,
          activeSessions: 3,
          totalPageViews: 456,
          totalDownloads: 23,
          avgTimeSpent: 127
        },
        periods: {
          last24h: { events: 45, pageViews: 23, uniqueSessions: 12 },
          last7d: { events: 234, pageViews: 156, uniqueSessions: 45 },
          last30d: { events: 1247, pageViews: 456, uniqueSessions: 89 }
        },
        pages: {
          uniquePages: 4,
          mostVisited: {
            '/': 234,
            '/projets': 89,
            '/contact': 67,
            '/admin': 12
          }
        },
        buttons: {
          'Découvrir mes projets': 45,
          'Télécharger CV': 23,
          'Démarrer un projet': 12,
          'Planifier un appel': 8
        },
        downloads: {
          'CV_Ambroise_Krzanowski.pdf': 23,
          'Portfolio_Projects.pdf': 5
        },
        sessions: [
          {
            session_id: 'session_1',
            start_time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            last_activity: new Date(Date.now() - 5 * 60 * 1000),
            page_views: 4,
            time_spent: 180000,
            events_count: 6
          },
          {
            session_id: 'session_2',
            start_time: new Date(Date.now() - 1 * 60 * 60 * 1000),
            last_activity: new Date(Date.now() - 10 * 60 * 1000),
            page_views: 3,
            time_spent: 120000,
            events_count: 4
          }
        ]
      }
      
      setStats(mockStats)
      setIsLoading(false)
    }

    loadStats()
  }, [])

  const getPeriodData = () => {
    if (!stats) return { events: 0, pageViews: 0, uniqueSessions: 0 }
    return stats.periods[`last${selectedPeriod}` as keyof typeof stats.periods]
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Dashboard Analytics</h2>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-primary-cyan text-white'
                  : 'bg-white/10 text-text-secondary hover:bg-white/20'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-violet">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-1">
            {getPeriodData().uniqueSessions}
          </h3>
          <p className="text-text-secondary text-sm">Visiteurs uniques</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-pink">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-1">
            {getPeriodData().pageViews}
          </h3>
          <p className="text-text-secondary text-sm">Pages vues</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-pink to-primary-cyan">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-1">
            {formatTime(stats.overview.avgTimeSpent)}
          </h3>
          <p className="text-text-secondary text-sm">Temps moyen</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500">
              <Download className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-1">
            {stats.overview.totalDownloads}
          </h3>
          <p className="text-text-secondary text-sm">Téléchargements</p>
        </motion.div>
      </div>

      {/* Graphiques et analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages les plus visitées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-cyan" />
            <h3 className="text-xl font-bold text-text-primary">Pages les plus visitées</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.pages.mostVisited)
              .sort(([,a], [,b]) => b - a)
              .map(([page, views], index) => (
                <div key={page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-cyan/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-cyan">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">{page}</p>
                      <p className="text-text-secondary text-sm">Page</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-text-primary font-bold">{views}</p>
                    <p className="text-text-secondary text-sm">vues</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Boutons les plus cliqués */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <MousePointer className="w-6 h-6 text-primary-violet" />
            <h3 className="text-xl font-bold text-text-primary">Boutons les plus cliqués</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.buttons)
              .sort(([,a], [,b]) => b - a)
              .map(([button, clicks], index) => (
                <div key={button} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-violet/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-violet">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">{button}</p>
                      <p className="text-text-secondary text-sm">Bouton CTA</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-text-primary font-bold">{clicks}</p>
                    <p className="text-text-secondary text-sm">clics</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Sessions récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-primary-pink" />
          <h3 className="text-xl font-bold text-text-primary">Sessions récentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-text-secondary text-sm">Session</th>
                <th className="text-left py-3 text-text-secondary text-sm">Début</th>
                <th className="text-left py-3 text-text-secondary text-sm">Dernière activité</th>
                <th className="text-left py-3 text-text-secondary text-sm">Pages vues</th>
                <th className="text-left py-3 text-text-secondary text-sm">Temps passé</th>
                <th className="text-left py-3 text-text-secondary text-sm">Événements</th>
              </tr>
            </thead>
            <tbody>
              {stats.sessions.slice(0, 10).map((session) => (
                <tr key={session.session_id} className="border-b border-white/5">
                  <td className="py-3 text-text-primary font-mono text-sm">
                    {session.session_id.slice(-8)}
                  </td>
                  <td className="py-3 text-text-secondary text-sm">
                    {formatDate(session.start_time)}
                  </td>
                  <td className="py-3 text-text-secondary text-sm">
                    {formatDate(session.last_activity)}
                  </td>
                  <td className="py-3 text-text-primary text-sm">
                    {session.page_views}
                  </td>
                  <td className="py-3 text-text-primary text-sm">
                    {formatTime(Math.round(session.time_spent / 1000))}
                  </td>
                  <td className="py-3 text-text-primary text-sm">
                    {session.events_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Téléchargements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-text-primary">Fichiers téléchargés</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(stats.downloads)
            .sort(([,a], [,b]) => b - a)
            .map(([file, downloads]) => (
              <div key={file} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-400/20">
                    <Download className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">{file}</p>
                    <p className="text-text-secondary text-sm">Fichier</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-bold">{downloads}</p>
                  <p className="text-text-secondary text-sm">téléchargements</p>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdvancedDashboard



