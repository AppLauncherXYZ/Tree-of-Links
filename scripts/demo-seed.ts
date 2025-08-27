#!/usr/bin/env tsx

/**
 * Demo Seed Script
 *
 * Seeds mock data for development and demo purposes.
 * This script populates the in-memory mock storage with sample links and themes.
 *
 * Usage:
 *   pnpm tsx scripts/demo-seed.ts
 *   # or
 *   npx tsx scripts/demo-seed.ts
 */

import { createOrUpdateUser } from '../src/integrations/applauncher/auth';
import { createLink } from '../src/integrations/applauncher/links';
import { saveTheme } from '../src/integrations/applauncher/db';

// Demo user data
const demoUsers = [
  {
    id: 'demo-user-1',
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Full-stack developer passionate about building great user experiences. Check out my latest projects and work!',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'demo-user-2',
    username: 'sarahsmith',
    displayName: 'Sarah Smith',
    bio: 'Designer & entrepreneur. Creating beautiful digital experiences with modern design principles.',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'demo-user-3',
    username: 'alexcoder',
    displayName: 'Alex Chen',
    bio: 'AI/ML engineer building the next generation of intelligent applications. Always learning, always building.',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Demo links data
const demoLinks = [
  // John Doe's links
  {
    userId: 'demo-user-1',
    title: 'My Portfolio',
    url: 'https://johndoe.dev',
    icon: 'globe',
    isPremium: false,
    isVisible: true,
    order: 0
  },
  {
    userId: 'demo-user-1',
    title: 'GitHub',
    url: 'https://github.com/johndoe',
    icon: 'github',
    isPremium: false,
    isVisible: true,
    order: 1
  },
  {
    userId: 'demo-user-1',
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/johndoe',
    icon: 'linkedin',
    isPremium: false,
    isVisible: true,
    order: 2
  },
  {
    userId: 'demo-user-1',
    title: 'Premium Blog',
    url: 'https://johndoe.dev/blog',
    icon: 'book',
    isPremium: true,
    isVisible: false,
    order: 3
  },

  // Sarah Smith's links
  {
    userId: 'demo-user-2',
    title: 'Design Portfolio',
    url: 'https://sarahsmith.design',
    icon: 'palette',
    isPremium: false,
    isVisible: true,
    order: 0
  },
  {
    userId: 'demo-user-2',
    title: 'Dribbble',
    url: 'https://dribbble.com/sarahsmith',
    icon: 'camera',
    isPremium: false,
    isVisible: true,
    order: 1
  },
  {
    userId: 'demo-user-2',
    title: 'Behance',
    url: 'https://behance.net/sarahsmith',
    icon: 'briefcase',
    isPremium: false,
    isVisible: true,
    order: 2
  },
  {
    userId: 'demo-user-2',
    title: 'Premium Templates',
    url: 'https://sarahsmith.design/templates',
    icon: 'star',
    isPremium: true,
    isVisible: true,
    order: 3
  },

  // Alex Chen's links
  {
    userId: 'demo-user-3',
    title: 'Personal Website',
    url: 'https://alexcoder.dev',
    icon: 'code',
    isPremium: false,
    isVisible: true,
    order: 0
  },
  {
    userId: 'demo-user-3',
    title: 'GitHub Profile',
    url: 'https://github.com/alexcoder',
    icon: 'github',
    isPremium: false,
    isVisible: true,
    order: 1
  },
  {
    userId: 'demo-user-3',
    title: 'AI Research',
    url: 'https://alexcoder.dev/research',
    icon: 'brain',
    isPremium: true,
    isVisible: false,
    order: 2
  }
];

// Demo themes data
const demoThemes = [
  {
    userId: 'demo-user-1',
    name: 'Ocean Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop',
    font: 'Inter',
    isDarkMode: false
  },
  {
    userId: 'demo-user-2',
    name: 'Sunset Glow',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      text: '#ffffff'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    font: 'Poppins',
    isDarkMode: true
  },
  {
    userId: 'demo-user-3',
    name: 'Dark Tech',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      text: '#f1f5f9'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    font: 'JetBrains Mono',
    isDarkMode: true
  }
];

/**
 * Seed demo users
 */
async function seedUsers() {
  console.log('🌱 Seeding demo users...');

  for (const user of demoUsers) {
    try {
      await createOrUpdateUser(user);
      console.log(`  ✅ Created user: ${user.username} (${user.displayName})`);
    } catch (error) {
      console.log(`  ⚠️  User ${user.username} already exists or error occurred:`, error);
    }
  }
}

/**
 * Seed demo links
 */
async function seedLinks() {
  console.log('🔗 Seeding demo links...');

  for (const link of demoLinks) {
    try {
      await createLink(link);
      console.log(`  ✅ Created link: ${link.title} for ${link.userId}`);
    } catch (error) {
      console.log(`  ⚠️  Error creating link ${link.title}:`, error);
    }
  }
}

/**
 * Seed demo themes
 */
async function seedThemes() {
  console.log('🎨 Seeding demo themes...');

  for (const theme of demoThemes) {
    try {
      await saveTheme(theme);
      console.log(`  ✅ Created theme: ${theme.name} for ${theme.userId}`);
    } catch (error) {
      console.log(`  ⚠️  Error creating theme ${theme.name}:`, error);
    }
  }
}

/**
 * Display summary of seeded data
 */
async function displaySummary() {
  console.log('\n📊 Demo Data Summary:');

  for (const user of demoUsers) {
    console.log(`\n👤 ${user.displayName} (${user.username})`);
    console.log(`   Profile: http://localhost:3000/${user.username}`);

    // Note: In a real implementation, you'd want to filter links by user
    // For now, we'll just show that the data was seeded
    console.log(`   Links: Demo links created`);
    console.log(`   Theme: Custom theme applied`);
  }
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🚀 Starting Tree of Links Demo Seed...\n');

  try {
    // Ensure we're using mocks (this script should only run in development)
    if (process.env.USE_MOCKS === 'false') {
      console.error('❌ This script should only be run with USE_MOCKS=true or in development mode');
      process.exit(1);
    }

    await seedUsers();
    await seedLinks();
    await seedThemes();
    await displaySummary();

    console.log('\n🎉 Demo seeding complete!');
    console.log('📝 You can now visit the demo profiles at:');
    console.log('   • http://localhost:3000/johndoe');
    console.log('   • http://localhost:3000/sarahsmith');
    console.log('   • http://localhost:3000/alexcoder');
    console.log('\n💡 Start the development server with: pnpm dev');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  main().catch(console.error);
}

export { main as seedDemoData };
