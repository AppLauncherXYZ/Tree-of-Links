// TODO: Swap to AppLauncher SDK

export interface Link {
  id: string;
  userId: string;
  title: string;
  url: string;
  description?: string;
  order: number;
  isPremium?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  userId: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock in-memory storage - replace with AppLauncher SDK
const mockLinks: Link[] = [
  {
    id: 'link-1',
    userId: 'user-1',
    title: 'My Portfolio',
    url: 'https://johndoe.dev',
    description: 'Check out my latest projects and work',
    order: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'link-2',
    userId: 'user-1',
    title: 'GitHub',
    url: 'https://github.com/johndoe',
    description: 'My open source contributions',
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'link-3',
    userId: 'user-1',
    title: 'Premium Blog',
    url: 'https://johndoe.dev/blog',
    description: 'Exclusive content for premium subscribers',
    order: 2,
    isPremium: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'link-4',
    userId: 'user-2',
    title: 'Design Portfolio',
    url: 'https://sarahsmith.design',
    description: 'My design work and case studies',
    order: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'link-5',
    userId: 'user-2',
    title: 'Premium Design Resources',
    url: 'https://sarahsmith.design/resources',
    description: 'Exclusive design templates and assets',
    order: 1,
    isPremium: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
const mockThemes: Theme[] = [
  {
    id: 'theme-1',
    userId: 'user-1',
    name: 'Blue Ocean',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'theme-2',
    userId: 'user-2',
    name: 'Sunset Glow',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      text: '#ffffff'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * List all links for a user
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function listLinks(userId: string): Promise<Link[]> {
  // Mock implementation - replace with AppLauncher SDK
  return mockLinks.filter(link => link.userId === userId);
}

/**
 * Create a new link
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function createLink(link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> {
  // Mock implementation - replace with AppLauncher SDK
  const newLink: Link = {
    ...link,
    id: `link-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockLinks.push(newLink);
  return newLink;
}

/**
 * Update an existing link
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function updateLink(linkId: string, updates: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Link | null> {
  // Mock implementation - replace with AppLauncher SDK
  const linkIndex = mockLinks.findIndex(link => link.id === linkId);
  if (linkIndex === -1) return null;

  mockLinks[linkIndex] = {
    ...mockLinks[linkIndex],
    ...updates,
    updatedAt: new Date()
  };
  return mockLinks[linkIndex];
}

/**
 * Delete a link
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function deleteLink(linkId: string): Promise<boolean> {
  // Mock implementation - replace with AppLauncher SDK
  const linkIndex = mockLinks.findIndex(link => link.id === linkId);
  if (linkIndex === -1) return false;

  mockLinks.splice(linkIndex, 1);
  return true;
}

/**
 * Reorder links for a user
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function reorderLinks(userId: string, linkIds: string[]): Promise<boolean> {
  // Mock implementation - replace with AppLauncher SDK
  const userLinks = mockLinks.filter(link => link.userId === userId);
  if (userLinks.length !== linkIds.length) return false;

  // Update order based on new positions
  linkIds.forEach((linkId, index) => {
    const link = mockLinks.find(l => l.id === linkId);
    if (link) {
      link.order = index;
      link.updatedAt = new Date();
    }
  });

  return true;
}

/**
 * Get theme for a user
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function getTheme(userId: string): Promise<Theme | null> {
  // Mock implementation - replace with AppLauncher SDK
  return mockThemes.find(theme => theme.userId === userId) || null;
}

/**
 * Save theme for a user
 * TODO: Replace with AppLauncher SDK database operations
 */
export async function saveTheme(theme: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>): Promise<Theme> {
  // Mock implementation - replace with AppLauncher SDK
  const existingThemeIndex = mockThemes.findIndex(t => t.userId === theme.userId);

  if (existingThemeIndex >= 0) {
    // Update existing theme
    mockThemes[existingThemeIndex] = {
      ...mockThemes[existingThemeIndex],
      ...theme,
      updatedAt: new Date()
    };
    return mockThemes[existingThemeIndex];
  } else {
    // Create new theme
    const newTheme: Theme = {
      ...theme,
      id: `theme-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockThemes.push(newTheme);
    return newTheme;
  }
}
