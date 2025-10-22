'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  MessageCircle,
  Calendar,
  Download,
  Github,
  Linkedin
} from 'lucide-react'

const ContactCTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'ambroise.krzanowski@laposte.net',
      href: 'mailto:ambroise.krzanowski@laposte.net',
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 6 44 86 08 82',
      href: 'tel:+33644860882',
      description: 'Disponible 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Béthune, France',
      href: '#',
      description: 'Déplacements possibles'
    }
  ]

  const socialLinks = [
    { href: 'https://github.com/Krzanowski-Ambroise', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/ambroise-krzanowski/', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <section ref={ref} className="py-24 lg:py-32 relative">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Prêt à <span className="gradient-text">collaborer</span> ?
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discutons de votre projet de cybersécurité. Je suis disponible pour des 
              projets d'alternance, collaborations en sécurité applicative ou développement sécurisé.
            </motion.p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                className="glass p-6 rounded-2xl hover:bg-primary-cyan/10 transition-all duration-300 group"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-violet">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {method.title}
                </h3>
                <p className="text-primary-cyan font-medium mb-2">
                  {method.value}
                </p>
                <p className="text-text-secondary text-sm">
                  {method.description}
                </p>
              </motion.a>
            ))}
          </motion.div>


          {/* Social Links */}
          <motion.div
            className="flex justify-center space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 glass rounded-xl hover:bg-primary-cyan/20 transition-all duration-300 group"
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <social.icon className="w-6 h-6 text-text-secondary group-hover:text-primary-cyan transition-colors duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* Bottom Text */}
          <motion.p
            className="text-text-secondary mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            Disponible pour des projets d'alternance et des collaborations en cybersécurité
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default ContactCTA
