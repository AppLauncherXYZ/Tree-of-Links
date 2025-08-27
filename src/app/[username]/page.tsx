"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getUserByUsername } from '@/integrations/applauncher/auth'
import { getTheme, listLinks } from '@/integrations/applauncher/db'
import { trackClick } from '@/integrations/applauncher/analytics'
import { unlockPremiumLink, createTipSession } from '@/integrations/applauncher/payments'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LockIcon, ExternalLinkIcon } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  displayName?: string
  bio?: string
  avatar?: string
}

interface Link {
  id: string
  userId: string
  title: string
  url: string
  description?: string
  order: number
  isPremium?: boolean
  createdAt: Date
  updatedAt: Date
}

interface Theme {
  id: string
  userId: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  backgroundImage?: string
  font?: string
  isDarkMode?: boolean
  createdAt: Date
  updatedAt: Date
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<Theme | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [selectedPremiumLink, setSelectedPremiumLink] = useState<Link | null>(null)
  const [unlockingLink, setUnlockingLink] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        const userData = await getUserByUsername(username)
        if (!userData) {
          setError('User not found')
          return
        }
        setUser(userData)

        // Load theme and links in parallel
        const [themeData, linksData] = await Promise.all([
          getTheme(userData.id),
          listLinks(userData.id)
        ])

        setTheme(themeData)
        setLinks(linksData.sort((a, b) => a.order - b.order))
      } catch (err) {
        setError('Failed to load user data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [username])

  const handleLinkClick = async (link: Link) => {
    if (link.isPremium) {
      setSelectedPremiumLink(link)
      setPaywallOpen(true)
      return
    }

    // Track click and navigate
    try {
      await trackClick({
        linkId: link.id,
        userId: user!.id,
        referrer: document.referrer
      })
      window.open(link.url, '_blank')
    } catch (err) {
      console.error('Failed to track click:', err)
      window.open(link.url, '_blank')
    }
  }

  const handleUnlockPremiumLink = async () => {
    if (!selectedPremiumLink || !user) return

    setUnlockingLink(true)
    try {
      const unlocked = await unlockPremiumLink(selectedPremiumLink.id, user.id)
      if (unlocked) {
        // Track click and navigate
        await trackClick({
          linkId: selectedPremiumLink.id,
          userId: user.id,
          referrer: document.referrer
        })
        window.open(selectedPremiumLink.url, '_blank')
        setPaywallOpen(false)
      }
    } catch (err) {
      console.error('Failed to unlock premium link:', err)
    } finally {
      setUnlockingLink(false)
    }
  }

  const handleTipUser = async () => {
    if (!user) return

    try {
      const tipSession = await createTipSession(user.id)
      window.open(tipSession.url, '_blank')
    } catch (err) {
      console.error('Failed to create tip session:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme?.backgroundImage
          ? `url(${theme.backgroundImage}) center/cover no-repeat`
          : theme?.colors.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: theme?.font || 'inherit'
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* User Profile Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.displayName || user.username}
                width={120}
                height={120}
                className={`rounded-full mx-auto mb-4 border-4 shadow-lg ${
                  theme?.isDarkMode ? 'border-white/10' : 'border-white/20'
                }`}
              />
            )}
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme?.colors.text || '#ffffff' }}>
              {user.displayName || user.username}
            </h1>
            {user.bio && (
              <p className="text-lg opacity-90" style={{ color: theme?.colors.text || '#ffffff' }}>
                {user.bio}
              </p>
            )}
          </div>

          {/* Tip Button */}
          <Button
            onClick={handleTipUser}
            variant="outline"
            className="mb-8"
            style={{
              backgroundColor: theme?.isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              borderColor: theme?.colors.secondary || '#60a5fa',
              color: theme?.colors.text || '#ffffff'
            }}
          >
            Buy me a coffee ☕
          </Button>
        </div>

        {/* Links Section */}
        <Card
          className={`${theme?.isDarkMode ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white/10 backdrop-blur-sm border-white/20'}`}
        >
          <CardHeader>
            <h2 className="text-xl font-semibold text-center" style={{ color: theme?.colors.text || '#ffffff' }}>
              Links
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="group relative"
              >
                <Button
                  onClick={() => handleLinkClick(link)}
                  variant="outline"
                  className={`w-full justify-between h-auto p-4 transition-all duration-200 ${
                    theme?.isDarkMode
                      ? 'bg-black/5 hover:bg-black/10 border-white/10 hover:border-white/20'
                      : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30'
                  }`}
                  style={{
                    color: theme?.colors.text || '#ffffff'
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium flex items-center gap-2">
                      {link.title}
                      {link.isPremium && (
                        <LockIcon className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    {link.description && (
                      <div className="text-sm opacity-70 mt-1">
                        {link.description}
                      </div>
                    )}
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Paywall Modal */}
      <Dialog open={paywallOpen} onOpenChange={setPaywallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Premium Link</DialogTitle>
            <DialogDescription>
              This is a premium link. Unlock it to access exclusive content.
            </DialogDescription>
          </DialogHeader>

          {selectedPremiumLink && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">{selectedPremiumLink.title}</h3>
                {selectedPremiumLink.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPremiumLink.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaywallOpen(false)}
              disabled={unlockingLink}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnlockPremiumLink}
              disabled={unlockingLink}
            >
              {unlockingLink ? 'Unlocking...' : 'Unlock Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
