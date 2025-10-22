'use client'

import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Calendar,
  Download,
  Github,
  Linkedin,
  Shield,
  Code,
  Lock,
  Network
} from 'lucide-react'
import { useProfile } from '@/contexts/ProfileContext'

const ContactInfo = () => {
  const { profile } = useProfile()

  const contactDetails = profile ? [
    {
      icon: Mail,
      title: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, '')}`,
      description: 'Disponible 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: profile.location,
      href: '#',
      description: 'Déplacements possibles'
    }
  ] : []

  const socialLinks = profile ? [
    { href: profile.github, icon: Github, label: 'GitHub' },
    { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
  ] : []

  const services = [
    { icon: Shield, title: 'Sécurité Applicative', description: 'Analyse et sécurisation des applications' },
    { icon: Code, title: 'Développement Sécurisé', description: 'Code review et bonnes pratiques' },
    { icon: Lock, title: 'Tests de Sécurité', description: 'Penetration testing et vulnérabilités' },
    { icon: Network, title: 'Formation', description: 'Apprentissage continu en cybersécurité' },
  ]

  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <motion.div
        className="glass p-6 rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Informations de contact
        </h3>
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <motion.a
              key={index}
              href={detail.href}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-primary-cyan/10 transition-all duration-300 group"
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-violet">
                <detail.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-text-primary font-medium">{detail.title}</h4>
                <p className="text-primary-cyan">{detail.value}</p>
                <p className="text-text-secondary text-sm">{detail.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        className="glass p-6 rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Réseaux sociaux
        </h3>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 glass rounded-xl hover:bg-primary-cyan/20 transition-all duration-300 group"
              aria-label={social.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <social.icon className="w-6 h-6 text-text-secondary group-hover:text-primary-cyan transition-colors duration-300" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        className="glass p-6 rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Services proposés
        </h3>
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-cyan/10 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary-cyan to-primary-violet">
                <service.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-text-primary font-medium mb-1">{service.title}</h4>
                <p className="text-text-secondary text-sm">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


      {/* Availability */}
      <motion.div
        className="glass p-6 rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-primary-cyan" />
          <h3 className="text-xl font-bold text-text-primary">Disponibilité</h3>
        </div>
        <div className="space-y-2 text-text-secondary">
          <p>• Lundi - Vendredi : 9h00 - 18h00</p>
          <p>• Réponse email sous 24h</p>
          <p>• Urgences : 24h/7j</p>
          <p>• Déplacements en Île-de-France</p>
        </div>
      </motion.div>
    </div>
  )
}

export default ContactInfo
