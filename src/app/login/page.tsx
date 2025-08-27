"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { LogIn, User, Upload, Link as LinkIcon, Palette } from "lucide-react"
import Image from "next/image"
import { getCurrentUser, createOrUpdateUser, isUsernameAvailable, validateUsername } from "@/integrations/applauncher/auth"
import { createLink } from "@/integrations/applauncher/links"
import { saveTheme } from "@/integrations/applauncher/db"
import { AVAILABLE_ICONS } from "@/integrations/applauncher/links"

type OnboardingStep = 'username' | 'avatar' | 'link' | 'theme'

interface OnboardingData {
  username: string
  avatar: string
  linkTitle: string
  linkUrl: string
  linkIcon: string
  themeName: string
}

const THEME_OPTIONS = [
  { name: 'Blue Ocean', colors: { primary: '#3b82f6', secondary: '#60a5fa', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' } },
  { name: 'Sunset Glow', colors: { primary: '#f59e0b', secondary: '#fbbf24', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' } },
  { name: 'Forest Green', colors: { primary: '#10b981', secondary: '#34d399', background: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)', text: '#ffffff' } },
  { name: 'Purple Dream', colors: { primary: '#8b5cf6', secondary: '#a78bfa', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', text: '#ffffff' } }
]

export default function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('username')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    username: '',
    avatar: '',
    linkTitle: '',
    linkUrl: '',
    linkIcon: 'globe',
    themeName: 'Blue Ocean'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        // New user - show onboarding
        setShowOnboarding(true)
      } else if (!user.username) {
        // Existing user without username - show onboarding
        setShowOnboarding(true)
      } else {
        // Existing user with username - redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error("Failed to sign in")
      console.error("Error signing in:", error)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateUsername(onboardingData.username)
    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    try {
      const isAvailable = await isUsernameAvailable(onboardingData.username)
      if (!isAvailable) {
        toast.error("Username is already taken")
        return
      }

      setCurrentStep('avatar')
    } catch (error) {
      toast.error("Failed to validate username")
      console.error("Error validating username:", error)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock avatar upload - in real app, this would upload to a storage service
      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string
        setOnboardingData(prev => ({ ...prev, avatar: avatarUrl }))
        setCurrentStep('link')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!onboardingData.linkTitle.trim() || !onboardingData.linkUrl.trim()) {
      toast.error("Both title and URL are required")
      return
    }

    setCurrentStep('theme')
  }

  const handleThemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get current user or create a new one
      let currentUser = await getCurrentUser()

      // Update user profile
      const updatedUser = await createOrUpdateUser({
        id: currentUser?.id,
        username: onboardingData.username,
        avatar: onboardingData.avatar
      })

      // Create first link
      await createLink({
        userId: updatedUser.id,
        title: onboardingData.linkTitle,
        url: onboardingData.linkUrl,
        icon: onboardingData.linkIcon,
        isPremium: false,
        isVisible: true,
        order: 0
      })

      // Save theme
      const selectedTheme = THEME_OPTIONS.find(t => t.name === onboardingData.themeName)
      if (selectedTheme) {
        await saveTheme({
          userId: updatedUser.id,
          name: selectedTheme.name,
          colors: selectedTheme.colors,
          font: 'Inter',
          isDarkMode: false
        })
      }

      toast.success("Welcome! Your profile is ready.")
      router.push('/dashboard')
    } catch (error) {
      toast.error("Failed to complete setup")
      console.error("Error completing onboarding:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderOnboardingStep = () => {
    switch (currentStep) {
      case 'username':
        return (
          <form onSubmit={handleUsernameSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Choose Your Username
              </DialogTitle>
              <DialogDescription>
                Pick a unique username that will be your link tree address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={onboardingData.username}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, username: e.target.value }))}
                  className="col-span-3"
                  placeholder="yourname"
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground col-start-2 col-span-3">
                Your link tree will be available at: yoursite.com/{onboardingData.username || 'yourname'}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Continue
              </Button>
            </DialogFooter>
          </form>
        )

      case 'avatar':
        return (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Avatar
              </DialogTitle>
              <DialogDescription>
                Add a profile picture to make your link tree more personal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                {onboardingData.avatar && (
                  <Image
                    src={onboardingData.avatar}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="max-w-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('link')}
                >
                  Skip Avatar
                </Button>
              </div>
            </div>
          </div>
        )

      case 'link':
        return (
          <form onSubmit={handleLinkSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Add Your First Link
              </DialogTitle>
              <DialogDescription>
                Add your first link to get your link tree started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="linkTitle"
                  value={onboardingData.linkTitle}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, linkTitle: e.target.value }))}
                  className="col-span-3"
                  placeholder="My Website"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkUrl" className="text-right">
                  URL
                </Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={onboardingData.linkUrl}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  className="col-span-3"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkIcon" className="text-right">
                  Icon
                </Label>
                <Select
                  value={onboardingData.linkIcon}
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, linkIcon: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Continue
              </Button>
            </DialogFooter>
          </form>
        )

      case 'theme':
        return (
          <form onSubmit={handleThemeSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Your Theme
              </DialogTitle>
              <DialogDescription>
                Pick a theme that matches your style.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {THEME_OPTIONS.map((theme) => (
                  <div
                    key={theme.name}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      onboardingData.themeName === theme.name ? 'border-primary' : 'border-muted'
                    }`}
                    style={{ background: theme.colors.background }}
                    onClick={() => setOnboardingData(prev => ({ ...prev, themeName: theme.name }))}
                  >
                    <div className="text-white font-medium">{theme.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Setting up..." : "Complete Setup"}
              </Button>
            </DialogFooter>
          </form>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Tree of Links</CardTitle>
          <CardDescription>
            Create your personal link tree in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isSigningIn ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showOnboarding} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
          {renderOnboardingStep()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
