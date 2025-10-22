import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import NotificationContainer from '@/components/ui/NotificationContainer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ambroise Krzanowski - Alternant Cybersécurité',
  description: 'Portfolio d\'un alternant en cybersécurité avec un background en développement. Spécialisé en sécurité applicative et développement sécurisé.',
  keywords: ['cybersécurité', 'alternance', 'développement sécurisé', 'sécurité applicative', 'pentesting'],
  authors: [{ name: 'Ambroise Krzanowski' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <ProfileProvider>
          <NotificationProvider>
            <BackgroundAnimation />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
            <NotificationContainer />
          </NotificationProvider>
        </ProfileProvider>
      </body>
    </html>
  )
}
