# Tree of Links

A modern, monetizable link-in-bio template for AppLauncher that creates customizable profile pages with paid subscriptions, tips, and comprehensive analytics.

## Overview

Tree of Links is a **Linktree-style template** designed to plug into AppLauncher's existing infrastructure. Instead of duplicating database, authentication, and payment systems, this template focuses purely on the UI components and integration hooks that connect to your established AppLauncher services.

## Features

- **🎨 Customizable Bio Pages**: Drag-and-drop link organization with beautiful themes
- **💰 Monetization Ready**: Integration hooks for subscriptions, tips, and paywalled content
- **📊 Analytics Dashboard**: Real-time link click tracking and performance metrics
- **🔗 Unlimited Links**: Support for multiple link types (social, commerce, content)
- **📱 Mobile Optimized**: Responsive design that works perfectly on all devices
- **⚡ Fast & Lightweight**: Built with Next.js 15 and optimized for performance

## Architecture

This template is designed as a **pure UI + integration layer** that connects to AppLauncher's existing services:

```
┌─────────────────┐    ┌──────────────────┐
│   Tree of       │    │   AppLauncher    │
│   Links UI      │◄──►│   Services       │
│                 │    │                  │
├─────────────────┤    ├──────────────────┤
│ • Profile Pages │    │ • Database       │
│ • Link Manager  │    │ • Auth System    │
│ • Analytics UI  │    │ • Stripe Connect │
│ • Payment Forms │    │ • User Mgmt     │
└─────────────────┘    └──────────────────┘
```

## Integration Hooks

The template provides pre-built hooks for seamless AppLauncher integration:

```typescript
// Authentication
const { user, session } = useAppLauncherAuth()

// Database operations
const { profile, links, analytics } = useAppLauncherDB()

// Payment processing
const { subscriptions, tips } = useAppLauncherPayments()
```

## Quick Start

1. **Clone the template**
   ```bash
   npx create-next-app my-linktree --template tree-of-links
   ```

2. **Configure AppLauncher integration**
   ```bash
   # Add your AppLauncher service URLs
   cp .env.example .env.local
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Connect to AppLauncher services**
   - Update integration hooks with your service endpoints
   - Configure authentication callbacks
   - Set up payment webhook handlers

5. **Run development server**
   ```bash
   pnpm dev
   ```

## Customization

### Themes & Styling
- Built with Tailwind CSS v4
- Dark/light mode support
- Custom CSS variables for easy theming
- Component-based architecture for easy customization

### Link Types
- Social media profiles
- E-commerce product links
- Content platforms (YouTube, TikTok, etc.)
- Custom URLs with UTM tracking
- Paywalled content gates

### Analytics
- Click-through rates
- Geographic data
- Device/browser analytics
- Revenue tracking
- Custom event tracking

## AppLauncher Compatibility

This template is designed to work with:
- **Database**: Any SQL/NoSQL database via AppLauncher APIs
- **Authentication**: OAuth, JWT, or custom auth via AppLauncher
- **Payments**: Stripe, PayPal, or custom payment processors
- **Analytics**: Custom analytics service or third-party integrations

## Deployment

Deploy to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **AWS Amplify**
- **Docker** containers

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution process.

## License

MIT - See [LICENSE](./LICENSE) for details.

## Support

For questions about this template:
- Check the [AppLauncher documentation](https://applauncher.dev/docs)
- Open an issue on this repository
- Join our Discord community

---

**Built for AppLauncher** | Modern link-in-bio template with monetization
