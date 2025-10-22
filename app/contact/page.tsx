'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  Clock,
  MessageCircle,
  Calendar,
  Download,
  Github,
  Linkedin
} from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'

const ContactPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@alexandredubois.fr',
      href: 'mailto:contact@alexandredubois.fr',
      description: 'Réponse sous 24h',
      color: 'from-primary-cyan to-primary-violet'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 6 12 34 56 78',
      href: 'tel:+33612345678',
      description: 'Disponible 9h-18h',
      color: 'from-primary-violet to-primary-pink'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Béthune, France',
      href: '#',
      description: 'Déplacements possibles',
      color: 'from-primary-pink to-primary-cyan'
    }
  ]

  const socialLinks = [
    { href: 'https://github.com/Krzanowski-Ambroise', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/ambroise-krzanowski/', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom section-padding">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Contactez-<span className="gradient-text">moi</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-text-secondary mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Prêt à discuter de votre projet de cybersécurité ? Je suis disponible pour 
              des consultations, audits de sécurité ou développement d'architectures sécurisées.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8">
        <div className="container-custom section-padding">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${method.color}`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 text-center">
                  {method.title}
                </h3>
                <p className="text-primary-cyan font-medium mb-2 text-center">
                  {method.value}
                </p>
                <p className="text-text-secondary text-sm text-center">
                  {method.description}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={ref} className="py-8 pb-24">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
