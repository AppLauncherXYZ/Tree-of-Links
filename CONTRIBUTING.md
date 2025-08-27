# Contributing to Tree of Links

Thank you for your interest in contributing to Tree of Links! This document outlines the development process and guidelines for contributing to this AppLauncher template.

## Development Flow

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/applauncher/tree-of-links.git
cd tree-of-links

# Install dependencies with pnpm
pnpm install

# Start development server
pnpm dev
```

### 2. Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. Make Changes

- Follow the existing code style and patterns
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

### 4. Commit Guidelines

We follow conventional commit format:

```bash
# Features
git commit -m "feat: add drag-and-drop link reordering"

# Bug fixes
git commit -m "fix: resolve mobile layout issue on iOS"

# Documentation
git commit -m "docs: update integration guide for AppLauncher"

# Refactoring
git commit -m "refactor: simplify link validation logic"

# Breaking changes
git commit -m "feat!: migrate to new authentication flow"
```

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create pull request on GitHub
# - Use the PR template
# - Reference any related issues
# - Provide clear description of changes
```

## Code Style

- **TypeScript**: Strict mode enabled, use interfaces for props
- **React**: Functional components with hooks
- **Tailwind**: Utility-first approach, consistent spacing scale
- **Imports**: Group by type (React, third-party, local)
- **Naming**: camelCase for variables/functions, PascalCase for components

## Testing

```bash
# Run linter
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Integration Guidelines

Since this is an AppLauncher template:

- **No direct database calls** - use provided integration hooks
- **Authentication via AppLauncher** - don't implement custom auth
- **Payment processing through AppLauncher** - use payment integration hooks
- **Follow AppLauncher service patterns** for consistency

## Need Help?

- 📖 Check the [AppLauncher documentation](https://applauncher.dev/docs)
- 💬 Join our [Discord community](https://discord.gg/applauncher)
- 🐛 Open an [issue](https://github.com/applauncher/tree-of-links/issues) for bugs
- 💡 Start a [discussion](https://github.com/applauncher/tree-of-links/discussions) for questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
