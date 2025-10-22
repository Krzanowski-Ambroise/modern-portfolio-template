'use client'

import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'

interface Category {
  id: string
  label: string
  icon: any
}

interface ProjectFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const ProjectFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange
}: ProjectFilterProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
      {/* Search Bar */}
      <motion.div
        className="relative flex-1 max-w-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30'
                : 'glass text-text-secondary hover:text-text-primary hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <category.icon className="w-4 h-4" />
            <span className="font-medium">{category.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export default ProjectFilter


