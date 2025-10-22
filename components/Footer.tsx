'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Code,
  Lock,
  Network
} from 'lucide-react'
import { useProfile } from '@/contexts/ProfileContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { profile } = useProfile()

  const socialLinks = profile ? [
    { href: profile.github, icon: Github, label: 'GitHub' },
    { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: `mailto:${profile.email}`, icon: Mail, label: 'Email' },
  ] : []

  const quickLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/projets', label: 'Projets' },
    { href: '/contact', label: 'Contact' },
  ]

  const services = [
    { icon: Lock, label: 'Audit Sécurité' },
    { icon: Code, label: 'Développement Sécurisé' },
    { icon: Network, label: 'Architecture Sécurisée' },
  ]

  return (
    <footer className="relative bg-gradient-to-t from-black via-black/95 to-transparent">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container-custom section-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-violet">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">
                  {profile?.name || 'Ambroise Krzanowski'}
                </h3>
                <p className="text-text-secondary text-sm">
                  {profile?.title || 'Alternant Cybersécurité'}
                </p>
              </div>
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Alternant en cybersécurité avec un background en développement. 
              Passionné par la sécurité applicative et le développement sécurisé.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 glass rounded-lg hover:bg-primary-cyan/20 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-text-secondary group-hover:text-primary-cyan transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-text-primary mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-cyan transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-cyan rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-text-primary mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.label} className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-cyan/20">
                    <service.icon className="w-4 h-4 text-primary-cyan" />
                  </div>
                  <span className="text-text-secondary">{service.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-text-primary mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-cyan" />
                <span className="text-text-secondary">
                  {profile?.email || 'ambroise.krzanowski@laposte.net'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-cyan" />
                <span className="text-text-secondary">
                  {profile?.phone || '+33 6 44 86 08 82'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-cyan" />
                <span className="text-text-secondary">
                  {profile?.location || 'Béthune, France'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © {currentYear} Ambroise Krzanowski. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <Link href="/privacy" className="hover:text-primary-cyan transition-colors duration-300">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-primary-cyan transition-colors duration-300">
                Conditions
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
