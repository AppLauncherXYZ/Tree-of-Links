"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { trackClick } from '@/integrations/applauncher/analytics'
import { unlockPremiumLink, createTipSession, createSubscriptionSession } from '@/integrations/applauncher/payments'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LockIcon, ExternalLinkIcon, Share2Icon, CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

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

interface UserProfileClientProps {
  user: User
  theme: Theme | null
  links: Link[]
  username: string
}

export default function UserProfileClient({ user, theme, links, username }: UserProfileClientProps) {
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [selectedPremiumLink, setSelectedPremiumLink] = useState<Link | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : `/${username}`

  useEffect(() => {
    // Generate QR code for the profile URL
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${username}`
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: theme?.colors.text || '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Failed to generate QR code:', err))
    }
  }, [username, theme])

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
        userId: user.id,
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
    }
  }

  const handleTipUser = async () => {
    if (!user) return

    try {
      const tipSession = await createTipSession(user.id)
      window.open(tipSession.url, '_blank')

      setTimeout(async () => {
        if (selectedPremiumLink) {
          await handleUnlockPremiumLink()
        }
      }, 2000)
    } catch (err) {
      console.error('Failed to create tip session:', err)
    }
  }

  const handleSubscribeUser = async () => {
    if (!user) return

    try {
      const subscriptionSession = await createSubscriptionSession(user.id)
      window.open(subscriptionSession.url, '_blank')

      setTimeout(async () => {
        if (selectedPremiumLink) {
          await handleUnlockPremiumLink()
        }
      }, 2000)
    } catch (err) {
      console.error('Failed to create subscription session:', err)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile URL copied to clipboard!')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = profileUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Profile URL copied to clipboard!')
    }
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.displayName || user.username}&apos;s Profile`,
          text: `Check out ${user.displayName || user.username}&apos;s links!`,
          url: profileUrl,
        })
      } catch {
        // User cancelled sharing or error occurred
        console.log('Error sharing')
      }
    } else {
      copyToClipboard()
    }
  }

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

        {/* Share Section */}
        <Card
          className={`mb-8 ${theme?.isDarkMode ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white/10 backdrop-blur-sm border-white/20'}`}
        >
          <CardHeader>
            <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-2" style={{ color: theme?.colors.text || '#ffffff' }}>
              <Share2Icon className="w-5 h-5" />
              Share Profile
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className={`flex items-center gap-2 ${theme?.isDarkMode ? 'bg-black/5 hover:bg-black/10 border-white/10' : 'bg-white/5 hover:bg-white/10 border-white/20'}`}
                style={{ color: theme?.colors.text || '#ffffff' }}
              >
                <CopyIcon className="w-4 h-4" />
                Copy Link
              </Button>

              <Button
                onClick={shareProfile}
                variant="outline"
                className={`flex items-center gap-2 ${theme?.isDarkMode ? 'bg-black/5 hover:bg-black/10 border-white/10' : 'bg-white/5 hover:bg-white/10 border-white/20'}`}
                style={{ color: theme?.colors.text || '#ffffff' }}
              >
                <Share2Icon className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* QR Code Section */}
            {qrCodeUrl && (
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code for profile"
                    width={192}
                    height={192}
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm mt-2 opacity-70" style={{ color: theme?.colors.text || '#ffffff' }}>
                  Scan to visit profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Block */}
        <Card
          className={`mb-8 ${theme?.isDarkMode ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white/10 backdrop-blur-sm border-white/20'}`}
        >
          <CardHeader>
            <h2 className="text-xl font-semibold text-center" style={{ color: theme?.colors.text || '#ffffff' }}>
              Featured Content
            </h2>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {/* Video placeholder - you can replace this with actual video content */}
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm">Featured Video</p>
                </div>
              </div>

              {/* Product highlight placeholder */}
              <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Special Offer!</h3>
                <p className="text-sm opacity-90 mb-4">
                  Check out my latest project or product highlight here.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              This is a premium link. Choose how you&apos;d like to support this creator to access exclusive content.
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

          <DialogFooter className="flex-col space-y-2">
            <div className="flex w-full space-x-2">
              <Button
                variant="outline"
                onClick={handleTipUser}
                className="flex-1"
              >
                💝 Send Tip
              </Button>
              <Button
                variant="outline"
                onClick={handleSubscribeUser}
                className="flex-1"
              >
                📅 Subscribe Monthly
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setPaywallOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
