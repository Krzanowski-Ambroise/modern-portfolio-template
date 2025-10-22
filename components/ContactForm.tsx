'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    budget: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitStatus('success')
    setIsSubmitting(false)
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        budget: '',
        timeline: ''
      })
      setSubmitStatus('idle')
    }, 3000)
  }

  const budgetOptions = [
    'Moins de 5 000€',
    '5 000€ - 15 000€',
    '15 000€ - 50 000€',
    'Plus de 50 000€',
    'À discuter'
  ]

  const timelineOptions = [
    'Urgent (1-2 semaines)',
    'Court terme (1 mois)',
    'Moyen terme (2-3 mois)',
    'Long terme (3+ mois)',
    'Flexible'
  ]

  return (
    <div className="glass p-8 rounded-2xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Envoyez-moi un message
        </h2>
        <p className="text-text-secondary">
          Décrivez votre projet et je vous répondrai dans les plus brefs délais.
        </p>
      </motion.div>

      {submitStatus === 'success' && (
        <motion.div
          className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">
            Message envoyé avec succès ! Je vous répondrai bientôt.
          </span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
              placeholder="Votre nom"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
              placeholder="votre@email.com"
            />
          </motion.div>
        </div>

        {/* Company and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Entreprise
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
              placeholder="Nom de votre entreprise"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Sujet *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
              placeholder="Sujet de votre message"
            />
          </motion.div>
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Budget estimé
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 glass rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
            >
              <option value="">Sélectionnez un budget</option>
              {budgetOptions.map((option, index) => (
                <option key={index} value={option} className="bg-background">
                  {option}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-text-primary font-medium mb-2">
              Délai souhaité
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 glass rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300"
            >
              <option value="">Sélectionnez un délai</option>
              {timelineOptions.map((option, index) => (
                <option key={index} value={option} className="bg-background">
                  {option}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <label className="block text-text-primary font-medium mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 glass rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 transition-all duration-300 resize-none"
            placeholder="Décrivez votre projet en détail..."
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className="w-full btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Envoyer le message</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default ContactForm


