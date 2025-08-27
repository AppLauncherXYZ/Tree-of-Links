"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  LockIcon,
  ExternalLinkIcon,
  Share2Icon,
  CopyIcon,
  Edit3Icon,
  SaveIcon,
  XIcon,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Github,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Music,
  Camera,
  Heart,
  Star,
  Zap,
  Globe,
  ShoppingBag,
  BookOpen,
  Coffee,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'

// Enhanced Linktree Features
export type LinkType =
  | 'website'
  | 'social'
  | 'email'
  | 'phone'
  | 'location'
  | 'booking'
  | 'shop'
  | 'music'
  | 'video'
  | 'custom'

export type ButtonStyle =
  | 'classic'
  | 'gradient'
  | 'outline'
  | 'glass'
  | 'neon'
  | 'minimal'

export type TemplateLayout =
  | 'classic'
  | 'minimal'
  | 'cards'
  | 'bold'
  | 'magazine'
  | 'social'

interface Link {
  id: string
  userId: string
  title: string
  url: string
  description?: string
  order: number
  isPremium?: boolean
  isActive?: boolean
  type: LinkType
  icon?: string
  buttonStyle?: ButtonStyle
  customColor?: string
  clickCount?: number
  createdAt: Date
  updatedAt: Date
}

interface Theme {
  id: string
  userId: string
  name: string
  layout: TemplateLayout
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  backgroundImage?: string
  backgroundType: 'gradient' | 'solid' | 'image'
  font: string
  buttonStyle: ButtonStyle
  isDarkMode: boolean
  showAvatar: boolean
  showBio: boolean
  showSocialIcons: boolean
  createdAt: Date
  updatedAt: Date
}

/*
🎨 CUSTOMIZABLE LINKTREE TEMPLATE

This is a fully customizable Linktree-style template that you can personalize for your own use.

QUICK START:
1. Click "Edit Profile" above
2. Replace the template data below with your information
3. Customize your links to match your content
4. Try different themes and layouts
5. Add your social media links
6. Save and share your profile!

FEATURES:
- ✅ Mobile-responsive design
- ✅ Multiple template layouts (Classic, Minimal, Cards, Bold, Magazine, Social)
- ✅ Customizable themes and colors
- ✅ Multiple link types (social, email, website, shop, music, etc.)
- ✅ Social media integration
- ✅ QR code sharing
- ✅ Click tracking simulation
- ✅ Premium link support
- ✅ Template customization guide

TIPS:
- Use emojis in your link titles to make them more engaging
- Try different button styles (gradient, outline, glass, neon)
- Add your real social media links for better engagement
- Use the bio section to tell visitors about yourself
- Experiment with different template layouts
*/

// Template Data - Replace with your own information
const templateUserData = {
  id: "your-user-id",
  username: "yourusername", // 🔧 CHANGE THIS: Your desired username
  email: "your.email@example.com", // 🔧 CHANGE THIS: Your contact email
  displayName: "Your Name", // 🔧 CHANGE THIS: Your display name
  bio: "✨ Welcome to Your Profile!\n\nThis is a customizable Linktree template! Here's what you can do:\n\n🎯 Showcase your content with different link types\n🎨 Choose from 6 beautiful template layouts\n📱 Mobile-optimized for all devices\n📊 Track clicks and engagement\n💰 Monetize with premium links\n\n👆 Click 'Edit Profile' to customize everything!",
  avatar: null as string | null, // 🔧 ADD: Upload your profile picture
  banner: undefined, // 🔧 OPTIONAL: Add a banner image
  location: "Your Location", // 🔧 CHANGE THIS: City, Country
  website: "https://yourwebsite.com", // 🔧 CHANGE THIS: Your main website
  socialLinks: {
    instagram: "", // 🔧 ADD: https://instagram.com/yourusername
    twitter: "", // 🔧 ADD: https://twitter.com/yourusername
    youtube: "", // 🔧 ADD: https://youtube.com/@yourusername
    github: "", // 🔧 ADD: https://github.com/yourusername
    linkedin: "", // 🔧 ADD: https://linkedin.com/in/yourusername
    facebook: "" // 🔧 ADD: https://facebook.com/yourusername
  }
}

/*
🔗 TEMPLATE LINKS - Customize these for your needs!

This section shows different types of links you can include on your profile.
Each link has customizable properties:

🎯 LINK PROPERTIES:
- title: Display name (use emojis for engagement!)
- url: The actual link destination
- description: Short description of what visitors will find
- type: website, social, email, phone, shop, music, custom
- icon: Visual icon for the link
- buttonStyle: gradient, outline, glass, neon, classic, minimal
- isPremium: Locks link behind payment/tip

💡 CUSTOMIZATION TIPS:
- Use emojis in titles to make links more engaging
- Try different button styles to match your brand
- Premium links encourage monetization
- Social links automatically show platform icons
- Email links open user's default mail app
*/

// Template Links - Examples of different link types you can use
const templateLinks: Link[] = [
  {
    id: "1",
    userId: "your-user-id",
    title: "🌐 My Website", // 🔧 CUSTOMIZE: Your website/portfolio title
    url: "https://yourwebsite.com", // 🔧 CHANGE: Your actual website URL
    description: "Visit my main website for more info",
    order: 1,
    isPremium: false,
    isActive: true,
    type: 'website',
    icon: 'Globe',
    buttonStyle: 'gradient',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "your-user-id",
    title: "📧 Contact Me", // 🔧 CUSTOMIZE: Your contact method
    url: "mailto:your.email@example.com", // 🔧 CHANGE: Your email address
    description: "Get in touch for collaborations",
    order: 2,
    isPremium: false,
    isActive: true,
    type: 'email',
    icon: 'Mail',
    buttonStyle: 'neon',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "your-user-id",
    title: "📱 Follow on Instagram", // 🔧 CUSTOMIZE: Your social platform
    url: "https://instagram.com/yourusername", // 🔧 CHANGE: Your Instagram handle
    description: "Latest posts and stories",
    order: 3,
    isPremium: false,
    isActive: true,
    type: 'social',
    icon: 'Instagram',
    buttonStyle: 'outline',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    userId: "your-user-id",
    title: "🎵 My Music", // 🔧 CUSTOMIZE: Your music platform
    url: "https://open.spotify.com/user/yourusername", // 🔧 CHANGE: Your music profile
    description: "Listen to my latest tracks",
    order: 4,
    isPremium: false,
    isActive: true,
    type: 'music',
    icon: 'Music',
    buttonStyle: 'glass',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    userId: "your-user-id",
    title: "🛍️ Shop", // 🔧 CUSTOMIZE: Your store/shop name
    url: "https://yourshop.com", // 🔧 CHANGE: Your shop URL
    description: "Browse my digital products",
    order: 5,
    isPremium: true, // 💰 PREMIUM: Encourages purchases
    isActive: true,
    type: 'shop',
    icon: 'ShoppingBag',
    buttonStyle: 'gradient',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    userId: "your-user-id",
    title: "📝 Blog & Resources", // 🔧 CUSTOMIZE: Your content platform
    url: "https://yourblog.com", // 🔧 CHANGE: Your blog/content URL
    description: "Free tips, tutorials, and resources",
    order: 6,
    isPremium: false,
    isActive: true,
    type: 'custom',
    icon: 'BookOpen',
    buttonStyle: 'classic',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

/*
🎨 THEME CUSTOMIZATION - Make it your own!

Choose from 6 beautiful layouts:
• Classic: Traditional vertical layout
• Minimal: Clean, sparse design
• Cards: Card-based presentation
• Bold: High-contrast design
• Magazine: Multi-column layout
• Social: Social media focused

Customize colors, fonts, and button styles to match your brand!
*/

// Default Theme - Customize to match your brand
const templateTheme: Theme = {
  id: "theme-template",
  userId: "your-user-id",
  name: "Your Theme", // 🔧 CUSTOMIZE: Name your theme
  layout: 'classic', // 🔧 CHANGE: classic, minimal, cards, bold, magazine, social
  colors: {
    primary: "#3b82f6", // 🔧 CUSTOMIZE: Your main brand color
    secondary: "#60a5fa", // 🔧 CUSTOMIZE: Secondary accent color
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // 🔧 CUSTOMIZE: Background gradient or solid color
    text: "#ffffff", // 🔧 CUSTOMIZE: Text color
    accent: "#ffd93d", // 🔧 CUSTOMIZE: Accent color for highlights
  },
  backgroundImage: undefined, // 🔧 OPTIONAL: Add background image URL
  backgroundType: 'gradient', // 🔧 CHANGE: 'gradient', 'solid', or 'image'
  font: "Inter, sans-serif", // 🔧 CUSTOMIZE: Choose your font family
  buttonStyle: 'gradient', // 🔧 CHANGE: gradient, outline, glass, neon, classic, minimal
  isDarkMode: false, // 🔧 TOGGLE: Dark or light theme
  showAvatar: true, // 🔧 TOGGLE: Show/hide profile picture
  showBio: true, // 🔧 TOGGLE: Show/hide bio section
  showSocialIcons: true, // 🔧 TOGGLE: Show/hide social media links
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Icon mapping function for dynamic icons
const getIcon = (iconName?: string) => {
  const icons: Record<string, any> = {
    Globe, Instagram, Twitter, Youtube, Facebook, Github, Mail, Phone,
    MapPin, Calendar, Music, Camera, Heart, Star, Zap, ShoppingBag, BookOpen, Coffee, Palette
  }
  const IconComponent = icons[iconName || 'Globe']
  return IconComponent || Globe
}

// Button style configurations
const buttonStyles = {
  classic: "bg-primary text-primary-foreground hover:bg-primary/90",
  gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90",
  outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
  neon: "bg-transparent border-2 border-primary text-primary shadow-lg shadow-primary/50 hover:shadow-primary/75",
  minimal: "bg-transparent text-primary hover:bg-primary/10"
}

export default function Home() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(templateUserData)
  const [links, setLinks] = useState(templateLinks)
  const [theme, setTheme] = useState(templateTheme)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateLayout>('classic')
  const [isUploading, setIsUploading] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}` : ''

  // Generate QR code when component mounts or theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.origin
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: theme.colors.text,
          light: '#FFFFFF'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Failed to generate QR code:', err))
    }
  }, [theme.colors.text]) // Regenerate when theme text color changes

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success('Profile saved successfully!')
  }

  const handleLinkClick = (link: Link) => {
    if (link.isPremium) {
      toast.error('Premium link - please support the creator first!')
      return
    }

    // Simulate click tracking
    const updatedLinks = links.map(l =>
      l.id === link.id ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l
    )
    setLinks(updatedLinks)

    window.open(link.url, '_blank')
  }

  const handleTemplateChange = (newTemplate: TemplateLayout) => {
    setSelectedTemplate(newTemplate)
    setTheme({ ...theme, layout: newTemplate })
    toast.success(`Switched to ${newTemplate} template!`)
  }

  // Profile picture upload handler
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUser({ ...user, avatar: result || null })
        toast.success('Profile picture updated!')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Failed to upload image')
      setIsUploading(false)
    }
  }

  // Social media URL validation and platform detection
  const validateSocialUrl = (url: string, platform: string) => {
    if (!url || url === '') return { isValid: true, platform: platform }

    const urlLower = url.toLowerCase()
    const platformPatterns: Record<string, RegExp> = {
      instagram: /instagram\.com/,
      twitter: /twitter\.com|x\.com/,
      youtube: /youtube\.com|youtu\.be/,
      github: /github\.com/,
      linkedin: /linkedin\.com/,
      facebook: /facebook\.com|fb\.com/
    }

    const pattern = platformPatterns[platform]
    if (pattern && !pattern.test(urlLower)) {
      return {
        isValid: false,
        platform: platform,
        error: `URL doesn't match ${platform} format`
      }
    }

    return { isValid: true, platform: platform }
  }

  // Handle social media URL changes
  const handleSocialUrlChange = (platform: string, url: string) => {
    const validation = validateSocialUrl(url, platform)

    if (!validation.isValid) {
      toast.error(validation.error!)
      return
    }

    setUser({
      ...user,
      socialLinks: {
        ...user.socialLinks,
        [platform]: url
      }
    })
  }

  // Link editing handlers
  const handleLinkEdit = (linkId: string) => {
    if (isEditing) {
      setEditingLinkId(editingLinkId === linkId ? null : linkId)
    }
  }

  const handleLinkUpdate = (linkId: string, field: keyof Link, value: any) => {
    setLinks(links.map(link =>
      link.id === linkId ? { ...link, [field]: value } : link
    ))
  }

  const handleLinkDelete = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId))
    toast.success('Link deleted!')
  }

  const handleAddLink = () => {
    const newLink: Link = {
      id: `link-${Date.now()}`,
      userId: user.id,
      title: 'New Link',
      url: '',
      description: '',
      order: links.length + 1,
      isPremium: false,
      isActive: true,
      type: 'website',
      icon: 'Globe',
      buttonStyle: 'classic',
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLinks([...links, newLink])
    setEditingLinkId(newLink.id)
    toast.success('New link added!')
  }

  const renderSocialIcons = () => {
    if (!theme.showSocialIcons || !user.socialLinks) return null

    return (
      <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-4 sm:px-0">
        {Object.entries(user.socialLinks).map(([platform, url]) => {
          if (!url) return null
          const IconComponent = getIcon(platform.charAt(0).toUpperCase() + platform.slice(1))
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all hover:scale-110 active:scale-95 touch-manipulation"
              aria-label={`${platform} profile`}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
          )
        })}
      </div>
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile URL copied to clipboard!')
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.displayName}'s Profile`,
          text: `Check out ${user.displayName}'s links!`,
          url: profileUrl,
        })
      } catch {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.colors.background,
        fontFamily: theme.font || 'inherit'
      }}
    >
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
        {/* Template Banner - Makes it clear this is customizable */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-200">
                🎨 Template Mode - Click Edit to Customize
              </span>
            </div>
            <div className="text-xs text-blue-300/70">
              Tree of Links
            </div>
          </div>

          {/* Animated background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>

          {/* Floating help indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-bounce">
            <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Simplified Header with Edit Controls */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] sm:min-h-0"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                  <span className="sm:hidden">✕</span>
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  className="min-h-[44px] sm:min-h-0"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">✓</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
              >
                <Edit3Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Customize Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}
          </div>
        </div>

        {/* User Profile Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Banner (if available) */}
          {user.banner && (
            <div className="w-full h-24 sm:h-32 rounded-t-2xl overflow-hidden mb-4 sm:mb-6">
              <Image
                src={user.banner}
                alt="Profile banner"
                width={600}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            {theme.showAvatar && (
              <>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.displayName || user.username}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-3 sm:mb-4 border-4 shadow-lg border-white/20 w-24 h-24 sm:w-30 sm:h-30"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-30 sm:h-30 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <span className="text-white text-xl sm:text-2xl font-bold">
                      {user.displayName?.split(' ').map(n => n[0]).join('') || user.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </>
            )}

            {isEditing ? (
              <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
                {/* Profile Picture Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Profile Picture</label>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-h-[44px] bg-white/10 border-white/20 text-white hover:bg-white/20"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            📸 Upload Photo
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-white/60 text-center">
                      JPG, PNG or GIF • Max 5MB
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-3">
                  <Input
                    value={user.displayName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser({...user, displayName: e.target.value})}
                    placeholder="Your Display Name"
                    className="text-center font-bold text-lg sm:text-xl bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <textarea
                    value={user.bio}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUser({...user, bio: e.target.value})}
                    placeholder="Tell visitors about yourself..."
                    className="w-full p-3 rounded-md border bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none text-sm sm:text-base"
                    rows={4}
                  />
                  <Input
                    value={user.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser({...user, location: e.target.value})}
                    placeholder="City, Country"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                {/* Social Media Integration */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    🌐 Connect Your Social Media
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Instagram */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Instagram className="w-3 h-3" />
                        Instagram
                      </label>
                      <Input
                        value={user.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialUrlChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>

                    {/* Twitter/X */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Twitter className="w-3 h-3" />
                        Twitter/X
                      </label>
                      <Input
                        value={user.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialUrlChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Youtube className="w-3 h-3" />
                        YouTube
                      </label>
                      <Input
                        value={user.socialLinks?.youtube || ''}
                        onChange={(e) => handleSocialUrlChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/@yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        GitHub
                      </label>
                      <Input
                        value={user.socialLinks?.github || ''}
                        onChange={(e) => handleSocialUrlChange('github', e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </label>
                      <Input
                        value={user.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialUrlChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 flex items-center gap-1">
                        <Facebook className="w-3 h-3" />
                        Facebook
                      </label>
                      <Input
                        value={user.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialUrlChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourusername"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-white/50 text-center">
                    💡 Just paste your profile URLs above - we'll handle the rest!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-2">
                  {user.displayName || user.username}
                </h1>
                {theme.showBio && user.bio && (
                  <p className="text-base sm:text-lg opacity-90 mb-3 sm:mb-4 px-4 sm:px-0" style={{ color: theme.colors.text }}>
                    {user.bio}
                  </p>
                )}
                {user.location && (
                  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 text-white/80">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{user.location}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Social Icons - Mobile Optimized */}
          {renderSocialIcons()}

          {/* Tip Button - Touch Friendly */}
          <Button
            variant="outline"
            className="mb-6 sm:mb-8 min-h-[48px] sm:min-h-0 px-6 sm:px-4 text-base sm:text-sm font-medium"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: theme.colors.secondary,
              color: theme.colors.text
            }}
          >
            ☕ Buy me a coffee
          </Button>
        </div>

        {/* Share Section - Mobile Optimized */}
        <Card
          className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-sm border-white/20 mx-4 sm:mx-0"
        >
          <CardHeader className="pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-center flex items-center justify-center gap-2" style={{ color: theme.colors.text }}>
              <Share2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              Share Profile
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border-white/20 min-h-[44px] sm:min-h-0 text-sm sm:text-base"
                style={{ color: theme.colors.text }}
              >
                <CopyIcon className="w-4 h-4" />
                📋 Copy Link
              </Button>

              <Button
                onClick={shareProfile}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border-white/20 min-h-[44px] sm:min-h-0 text-sm sm:text-base"
                style={{ color: theme.colors.text }}
              >
                <Share2Icon className="w-4 h-4" />
                📤 Share
              </Button>
            </div>

            {/* QR Code Section - Mobile Optimized */}
            {qrCodeUrl && (
              <div className="text-center">
                <div className="inline-block p-3 sm:p-4 bg-white rounded-lg shadow-lg">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code for profile"
                    width={192}
                    height={192}
                    className="w-32 h-32 sm:w-48 sm:h-48"
                  />
                </div>
                <p className="text-xs sm:text-sm mt-2 opacity-70 px-4" style={{ color: theme.colors.text }}>
                  📱 Scan to visit profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Block - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-sm border-white/20 mx-4 sm:mx-0">
          <CardHeader className="pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-center" style={{ color: theme.colors.text }}>
              🎬 Featured Content
            </h2>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-center">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm">Featured Video</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-lg p-4 sm:p-6 text-white">
                <h3 className="font-bold text-base sm:text-lg mb-2">🎯 Your Featured Content</h3>
                <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
                  Add your latest project, special offer, or featured content here.
                  Use this space to highlight what's most important to your visitors!
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100 min-h-[40px] sm:min-h-0 w-full sm:w-auto"
                >
                  📌 Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customization Guide - Shows when in edit mode */}
        {isEditing && (
          <Card className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 mx-4 sm:mx-0 mb-4 sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-black font-bold">💡</span>
                </div>
                <div className="text-sm text-amber-100">
                  <h4 className="font-semibold mb-2 text-amber-200">Quick Customization Guide:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Name & Bio:</strong> Click on the text above to edit</li>
                    <li>• <strong>Links:</strong> Update titles, URLs, and descriptions below</li>
                    <li>• <strong>Theme:</strong> Try different templates from the dropdown</li>
                    <li>• <strong>Social:</strong> Add your social media links in the bio section</li>
                    <li>• <strong>Save:</strong> Click save when you're done customizing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Links Section - Mobile Optimized */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mx-4 sm:mx-0">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.colors.text }}>
                🔗 Your Links
              </h2>
              {isEditing && (
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Click any link below to edit its title, URL, and style
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-2 sm:px-6">
            {links
              .filter(link => link.isActive)
              .sort((a, b) => a.order - b.order)
              .map((link) => {
                const IconComponent = getIcon(link.icon)
                const buttonStyle = buttonStyles[link.buttonStyle || theme.buttonStyle]
                const isEditingThisLink = editingLinkId === link.id

                return (
                  <div key={link.id} className="space-y-2">
                    {/* Edit Controls (when in edit mode) */}
                    {isEditing && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => handleLinkEdit(link.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 bg-white/10 border-white/20 text-white"
                        >
                          {isEditingThisLink ? '✕ Cancel' : '✏️ Edit'}
                        </Button>
                        <Button
                          onClick={() => handleLinkDelete(link.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    )}

                    {/* Link Editing Form */}
                    {isEditingThisLink && isEditing ? (
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-3 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              value={link.title}
                              onChange={(e) => handleLinkUpdate(link.id, 'title', e.target.value)}
                              placeholder="Link Title"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => handleLinkUpdate(link.id, 'url', e.target.value)}
                              placeholder="https://..."
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            />
                          </div>
                          <textarea
                            value={link.description}
                            onChange={(e) => handleLinkUpdate(link.id, 'description', e.target.value)}
                            placeholder="Description (optional)"
                            className="w-full p-2 rounded border bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <select
                              value={link.buttonStyle}
                              onChange={(e) => handleLinkUpdate(link.id, 'buttonStyle', e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                            >
                              <option value="classic">Classic</option>
                              <option value="gradient">Gradient</option>
                              <option value="outline">Outline</option>
                              <option value="glass">Glass</option>
                              <option value="neon">Neon</option>
                              <option value="minimal">Minimal</option>
                            </select>
                            <label className="flex items-center gap-1 text-white text-sm">
                              <input
                                type="checkbox"
                                checked={link.isPremium}
                                onChange={(e) => handleLinkUpdate(link.id, 'isPremium', e.target.checked)}
                                className="rounded"
                              />
                              💰 Premium
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* Regular Link Button */
                      <div className="group relative">
                        <Button
                          onClick={() => isEditing ? handleLinkEdit(link.id) : handleLinkClick(link)}
                          className={`w-full justify-between h-auto p-3 sm:p-4 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg active:scale-95 touch-manipulation ${buttonStyle}`}
                          style={{
                            background: link.customColor ? link.customColor : undefined,
                            borderColor: link.buttonStyle === 'outline' ? theme.colors.primary : undefined,
                          }}
                        >
                          <div className="text-left flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base truncate">
                                <span className="truncate">{link.title}</span>
                                {link.isPremium && (
                                  <LockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                                )}
                              </div>
                              {link.description && (
                                <div className="text-xs sm:text-sm opacity-70 mt-1 truncate">
                                  {link.description}
                                </div>
                              )}
                              {!isEditing && link.clickCount !== undefined && link.clickCount > 0 && (
                                <div className="text-xs opacity-50 mt-1">
                                  {link.clickCount.toLocaleString()} clicks
                                </div>
                              )}
                            </div>
                          </div>
                          <ExternalLinkIcon className="w-3 h-3 sm:w-4 sm:h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Add Link Button (in edit mode) */}
            {isEditing && (
              <Button
                onClick={handleAddLink}
                variant="outline"
                className="w-full min-h-[48px] bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30 border-dashed"
              >
                ➕ Add New Link
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
