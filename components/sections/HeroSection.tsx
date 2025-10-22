'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Mail, Shield, Code, Lock, Network } from 'lucide-react'
import Link from 'next/link'
import { usePageAnalytics, useButtonTracking, useDownloadTracking } from '@/hooks/useAnalytics'
import { useProfile } from '@/contexts/ProfileContext'

const HeroSection = () => {
  // Analytics
  usePageAnalytics('Accueil')
  const trackDiscoverProjects = useButtonTracking('Découvrir mes projets')
  const trackDownloadCV = useDownloadTracking('CV_Ambroise_Krzanowski.pdf')
  
  // Profil
  const { profile, isLoading } = useProfile()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const socialLinks = profile ? [
    { href: profile.github, icon: Github, label: 'GitHub' },
    { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: `mailto:${profile.email}`, icon: Mail, label: 'Email' },
  ] : []

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container-custom section-padding text-center z-10"
      >
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="gradient-text">{profile?.name?.split(' ')[0] || 'Ambroise'}</span>
            <br />
            <span className="text-text-primary">{profile?.name?.split(' ')[1] || 'Krzanowski'}</span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="mb-10">
          <motion.h2 
            className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary mb-3"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile?.title || 'Alternant en Cybersécurité'}
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Alternant en cybersécurité avec un background en développement. 
            Passionné par la sécurité applicative et le développement sécurisé.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 212, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={trackDiscoverProjects}
            className="btn-primary text-base px-6 py-3 flex items-center space-x-2 group"
          >
            <span>Découvrir mes projets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>

          <motion.a
            href="/api/cv/download"
            download="CV_Ambroise_Krzanowski.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={trackDownloadCV}
            className="btn-secondary text-base px-6 py-3 flex items-center space-x-2 group"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Télécharger CV</span>
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-6"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 glass rounded-xl hover:bg-primary-cyan/20 transition-all duration-300 group"
              aria-label={social.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <social.icon className="w-6 h-6 text-text-secondary group-hover:text-primary-cyan transition-colors duration-300" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { icon: Shield, x: '10%', y: '20%', delay: 0 },
          { icon: Code, x: '85%', y: '15%', delay: 0.5 },
          { icon: Lock, x: '15%', y: '70%', delay: 1 },
          { icon: Network, x: '80%', y: '75%', delay: 1.5 },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0.7, 1],
              scale: [0, 1, 0.8, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4,
              delay: item.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className="p-4 glass rounded-2xl">
              <item.icon className="w-8 h-8 text-primary-cyan" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-cyan rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary-cyan rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
