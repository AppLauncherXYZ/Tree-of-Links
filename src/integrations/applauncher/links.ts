// TODO: Swap to AppLauncher SDK

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isPremium: boolean;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock in-memory storage - replace with AppLauncher SDK
const mockLinks: Link[] = [
  {
    id: 'link-1',
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'github',
    isPremium: false,
    isVisible: true,
    order: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'link-2',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'linkedin',
    isPremium: false,
    isVisible: true,
    order: 1,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'link-3',
    title: 'Portfolio',
    url: 'https://example.com',
    icon: 'globe',
    isPremium: true,
    isVisible: false,
    order: 2,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  }
];

/**
 * Get all links for the current user, ordered by their order field
 */
export async function listLinks(): Promise<Link[]> {
  // Mock implementation - replace with AppLauncher SDK
  return [...mockLinks].sort((a, b) => a.order - b.order);
}

/**
 * Create a new link
 */
export async function createLink(linkData: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> {
  // Mock implementation - replace with AppLauncher SDK
  const newLink: Link = {
    ...linkData,
    id: `link-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockLinks.push(newLink);
  return newLink;
}

/**
 * Update an existing link
 */
export async function updateLink(id: string, updates: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Link> {
  // Mock implementation - replace with AppLauncher SDK
  const linkIndex = mockLinks.findIndex(link => link.id === id);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }

  mockLinks[linkIndex] = {
    ...mockLinks[linkIndex],
    ...updates,
    updatedAt: new Date(),
  };

  return mockLinks[linkIndex];
}

/**
 * Delete a link
 */
export async function deleteLink(id: string): Promise<void> {
  // Mock implementation - replace with AppLauncher SDK
  const linkIndex = mockLinks.findIndex(link => link.id === id);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }

  mockLinks.splice(linkIndex, 1);
}

/**
 * Reorder links by updating their order field
 */
export async function reorderLinks(linkIds: string[]): Promise<void> {
  // Mock implementation - replace with AppLauncher SDK
  linkIds.forEach((id, index) => {
    const linkIndex = mockLinks.findIndex(link => link.id === id);
    if (linkIndex !== -1) {
      mockLinks[linkIndex].order = index;
      mockLinks[linkIndex].updatedAt = new Date();
    }
  });
}

/**
 * Get available icons for links
 */
export const AVAILABLE_ICONS = [
  'github',
  'linkedin',
  'twitter',
  'instagram',
  'youtube',
  'globe',
  'mail',
  'phone',
  'map-pin',
  'calendar',
  'briefcase',
  'user',
  'heart',
  'star',
  'camera',
  'music',
  'book',
  'coffee',
  'code',
  'zap'
];
