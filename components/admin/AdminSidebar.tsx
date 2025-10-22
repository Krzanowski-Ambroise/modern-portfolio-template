'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Tag, 
  Wrench, 
  User,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
}

const AdminSidebar = ({ activeSection, onSectionChange, onLogout }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'projects', label: 'Projets', icon: FolderOpen },
    { id: 'categories', label: 'Catégories', icon: Tag },
    { id: 'technologies', label: 'Technologies', icon: Wrench },
    { id: 'documents', label: 'Mes Documents', icon: FileText },
  ]

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`h-screen glass border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-text-primary">Admin</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-cyan/20 text-primary-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminSidebar
