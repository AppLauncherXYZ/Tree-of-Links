# 🌲 Tree of Links - Customizable Linktree Template

A beautiful, fully customizable Linktree-style template built with Next.js 15, React 19, and Tailwind CSS. Perfect for creators, businesses, and personal branding.

![Tree of Links Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Tree+of+Links+Template)

## ✨ Features

### 🎨 **Easy Customization**
- **Profile Picture Upload** - Upload your own profile picture with instant preview
- **Personal Information** - Customize name, bio, and location
- **Social Media Integration** - Connect Instagram, Twitter/X, YouTube, GitHub, LinkedIn, and Facebook
- **Link Management** - Add, edit, and delete links with custom styles

### 📱 **Mobile-First Design**
- **Responsive Layout** - Perfect experience on all devices
- **Touch-Friendly** - Optimized for mobile interaction
- **Fast Loading** - Streamlined codebase with no bloat

### 🚀 **Advanced Features**
- **Multiple Button Styles** - 6 different link button styles (Classic, Gradient, Outline, Glass, Neon, Minimal)
- **Premium Link Support** - Mark links as premium with lock icons
- **Click Tracking** - Simulated analytics for link engagement
- **QR Code Generation** - Automatic QR code for easy sharing
- **Theme Customization** - Ready for future theme extensions

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **React:** React 19 with Hooks
- **Styling:** Tailwind CSS 4 with custom properties
- **Icons:** Lucide React
- **QR Codes:** QRCode.js
- **Notifications:** Sonner
- **UI Components:** Radix UI primitives

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AppLauncherXYZ/Tree-of-Links.git
   cd tree-of-links
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### For New Users

1. **Visit the site** - You'll see the template with placeholder content
2. **Click "Customize Profile"** - Enter edit mode
3. **Upload Profile Picture** - Click the upload button and select your image
4. **Edit Basic Info** - Update your name, bio, and location
5. **Add Social Links** - Paste your social media profile URLs
6. **Customize Links** - Edit existing links or add new ones
7. **Save Changes** - Your personalized profile is ready!

### Customization Guide

#### Profile Picture
- Click the "📸 Upload Photo" button
- Select JPG, PNG, or GIF (max 5MB)
- Image updates instantly

#### Social Media Setup
- Enter your profile URLs for each platform
- URLs are automatically validated
- Supported platforms: Instagram, Twitter/X, YouTube, GitHub, LinkedIn, Facebook

#### Link Management
- **Edit Links:** Click any link to modify title, URL, and description
- **Add Links:** Click "➕ Add New Link" button
- **Delete Links:** Use the delete button next to each link
- **Button Styles:** Choose from 6 different styles per link
- **Premium Links:** Toggle premium status with lock icons

## 🎨 Customization Options

### Profile Settings
```javascript
// Example customization
const userProfile = {
  displayName: "Your Name",
  bio: "Your bio here...",
  location: "City, Country",
  avatar: "your-profile-picture.jpg",
  socialLinks: {
    instagram: "https://instagram.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    youtube: "https://youtube.com/@yourusername",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    facebook: "https://facebook.com/yourusername"
  }
}
```

### Link Configuration
```javascript
const linkExample = {
  title: "My Website",
  url: "https://yourwebsite.com",
  description: "Visit my main website",
  buttonStyle: "gradient", // classic, gradient, outline, glass, neon, minimal
  isPremium: false,
  icon: "Globe"
}
```

### Available Button Styles
- **Classic** - Simple, clean design
- **Gradient** - Beautiful color gradients
- **Outline** - Border-only style
- **Glass** - Frosted glass effect
- **Neon** - Glowing neon effect
- **Minimal** - Minimalist design

## 📱 Mobile Optimization

The template is fully optimized for mobile devices:

- **Touch Targets** - All buttons meet 44px minimum size
- **Responsive Text** - Scales appropriately across devices
- **Mobile Navigation** - Optimized header controls
- **Grid Layouts** - Adaptive social media and link sections

## 🏗️ Project Structure

```
tree-of-links/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main template page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── next.config.ts          # Next.js configuration
```

## 🔧 Development

### Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Environment Variables
Create a `.env.local` file for environment variables:
```bash
# Add your environment variables here
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Tailwind CSS** - A utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon toolkit
- **Radix UI** - Unstyled, accessible UI primitives

## 📞 Support

If you have any questions or need help:

- 📧 **Email:** your-email@example.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/AppLauncherXYZ/Tree-of-Links/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/AppLauncherXYZ/Tree-of-Links/discussions)

---

**Made with ❤️ using Next.js and Tailwind CSS**

[🌐 Live Demo](https://tree-of-links.vercel.app) • [📖 Documentation](https://docs.tree-of-links.com) • [🐛 Report Bug](https://github.com/AppLauncherXYZ/Tree-of-Links/issues)
