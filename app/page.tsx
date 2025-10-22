'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Code, 
  Lock, 
  Network, 
  ArrowRight, 
  Download,
  Github,
  Linkedin,
  Mail,
  Star,
  Award,
  Target
} from 'lucide-react'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsPreviewDynamic from '@/components/sections/ProjectsPreviewDynamic'
import ContactCTA from '@/components/sections/ContactCTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsPreviewDynamic />
      <ContactCTA />
    </div>
  )
}
