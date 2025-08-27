"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/integrations/applauncher/auth"
import { getTheme, saveTheme } from "@/integrations/applauncher/db"
import { Upload, Palette, Type, Moon, Sun } from "lucide-react"
import Image from "next/image"
import { ThemeTabSkeleton } from "@/components/ui/skeleton-loaders"

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

const FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
]

const PRESET_THEMES = [
  {
    name: "Blue Ocean",
    colors: {
      primary: "#3b82f6",
      secondary: "#60a5fa",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff"
    }
  },
  {
    name: "Sunset Glow",
    colors: {
      primary: "#f59e0b",
      secondary: "#fbbf24",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      text: "#ffffff"
    }
  },
  {
    name: "Forest Green",
    colors: {
      primary: "#10b981",
      secondary: "#34d399",
      background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
      text: "#ffffff"
    }
  },
  {
    name: "Purple Dream",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
      text: "#ffffff"
    }
  }
]

export function ThemeTab() {
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewLinks] = useState([
    { id: '1', title: 'My Portfolio', description: 'Check out my latest work', url: '#' },
    { id: '2', title: 'GitHub', description: 'My open source projects', url: '#' },
    { id: '3', title: 'Blog', description: 'Thoughts and insights', url: '#' }
  ])

  useEffect(() => {
    loadUserAndTheme()
  }, [])

  const loadUserAndTheme = async () => {
    try {
      setLoading(true)
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userTheme = await getTheme(currentUser.id)
        if (userTheme) {
          setTheme(userTheme)
        } else {
          // Create default theme
          const defaultTheme: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'> = {
            userId: currentUser.id,
            name: 'Default Theme',
            colors: {
              primary: '#3b82f6',
              secondary: '#60a5fa',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              text: '#ffffff'
            },
            isDarkMode: false
          }
          const savedTheme = await saveTheme(defaultTheme)
          setTheme(savedTheme)
        }
      }
    } catch (error) {
      console.error('Failed to load user and theme:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTheme = async () => {
    if (!theme || !user) return

    try {
      setSaving(true)
      await saveTheme(theme)
      // Show success message
    } catch (error) {
      console.error('Failed to save theme:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateTheme = (updates: Partial<Theme>) => {
    if (!theme) return
    setTheme({ ...theme, ...updates })
  }

  const updateColors = (colorUpdates: Partial<Theme['colors']>) => {
    if (!theme) return
    setTheme({
      ...theme,
      colors: { ...theme.colors, ...colorUpdates }
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateTheme({ backgroundImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const applyPresetTheme = (preset: typeof PRESET_THEMES[0]) => {
    if (!theme) return
    setTheme({
      ...theme,
      colors: preset.colors,
      name: preset.name
    })
  }

  if (loading) {
    return <ThemeTabSkeleton />
  }

  if (!theme || !user) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Failed to load theme settings</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Controls Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Controls
            </CardTitle>
            <CardDescription>
              Customize the appearance of your link tree.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium flex items-center gap-2">
                  {theme.isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </div>
                <div className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </div>
              </div>
              <Switch
                checked={theme.isDarkMode || false}
                onCheckedChange={(checked) => updateTheme({ isDarkMode: checked })}
              />
            </div>

            {/* Primary Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={theme.colors.primary}
                  onChange={(e) => updateColors({ primary: e.target.value })}
                  className="w-12 h-10 border rounded cursor-pointer"
                  aria-label="Choose primary color"
                />
                <Input
                  value={theme.colors.primary}
                  onChange={(e) => updateColors({ primary: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            {/* Secondary Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={theme.colors.secondary}
                  onChange={(e) => updateColors({ secondary: e.target.value })}
                  className="w-12 h-10 border rounded cursor-pointer"
                  aria-label="Choose secondary color"
                />
                <Input
                  value={theme.colors.secondary}
                  onChange={(e) => updateColors({ secondary: e.target.value })}
                  placeholder="#60a5fa"
                />
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="background-color"
                  type="color"
                  value={theme.colors.background.startsWith('#') ? theme.colors.background : '#667eea'}
                  onChange={(e) => updateColors({ background: e.target.value })}
                  className="w-12 h-10 border rounded cursor-pointer"
                  aria-label="Choose background color"
                />
                <Input
                  value={theme.colors.background}
                  onChange={(e) => updateColors({ background: e.target.value })}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
            </div>

            {/* Background Image Upload */}
            <div className="space-y-2">
              <Label>Background Image</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="background-image"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('background-image')?.click()}
                  className="flex items-center gap-2"
                  aria-label="Upload background image"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                {theme.backgroundImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTheme({ backgroundImage: undefined })}
                    aria-label="Remove background image"
                  >
                    Remove
                  </Button>
                )}
              </div>
              {theme.backgroundImage && (
                <div className="mt-2">
                  <Image
                    src={theme.backgroundImage}
                    alt="Background preview"
                    width={100}
                    height={60}
                    className="rounded border object-cover"
                  />
                </div>
              )}
            </div>

            {/* Font Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Family
              </Label>
              <Select
                value={theme.font || ""}
                onValueChange={(value) => updateTheme({ font: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preset Themes */}
            <div className="space-y-3">
              <Label>Preset Themes</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_THEMES.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => applyPresetTheme(preset)}
                    className="justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{preset.name}</div>
                      <div
                        className="w-full h-2 rounded mt-1"
                        style={{ background: preset.colors.background }}
                      />
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveTheme}
              disabled={saving}
              className="w-full"
              aria-label="Save current theme settings"
            >
              {saving ? 'Saving...' : 'Save Theme'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              See how your theme looks on your profile page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border rounded-lg overflow-hidden"
              style={{
                background: theme.backgroundImage
                  ? `url(${theme.backgroundImage}) center/cover no-repeat`
                  : theme.colors.background,
                fontFamily: theme.font || 'inherit'
              }}
            >
              <div className="p-6">
                {/* Mini Profile Preview */}
                <div className="text-center mb-8">
                  <div className="mb-4">
                    <div
                      className="w-16 h-16 rounded-full mx-auto border-2 flex items-center justify-center text-xl font-bold"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: theme.colors.secondary,
                        color: theme.colors.text
                      }}
                    >
                      {user.displayName?.[0] || user.username[0].toUpperCase()}
                    </div>
                    <h2
                      className="text-xl font-bold mt-2"
                      style={{ color: theme.colors.text }}
                    >
                      {user.displayName || user.username}
                    </h2>
                    {user.bio && (
                      <p
                        className="text-sm opacity-90 mt-1"
                        style={{ color: theme.colors.text }}
                      >
                        {user.bio.length > 50 ? `${user.bio.substring(0, 50)}...` : user.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mini Links Preview */}
                <div className="space-y-3">
                  {previewLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: theme.colors.text
                      }}
                    >
                      <div className="font-medium">{link.title}</div>
                      {link.description && (
                        <div className="text-sm opacity-70">{link.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
