// TODO: Swap to AppLauncher SDK

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

// Mock in-memory storage - replace with AppLauncher SDK
const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    bio: 'Full-stack developer passionate about building great user experiences.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    displayName: 'Sarah Smith',
    bio: 'Designer & entrepreneur. Creating beautiful digital experiences.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  }
];

/**
 * Get user by username
 * TODO: Replace with AppLauncher SDK authentication
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  // Mock implementation - replace with AppLauncher SDK
  return mockUsers.find(user => user.username === username) || null;
}

/**
 * Get the current authenticated user
 * TODO: Replace with AppLauncher SDK authentication
 */
export async function getCurrentUser(): Promise<User | null> {
  // Mock implementation - replace with AppLauncher SDK
  return mockUsers[0]; // Return first mock user
}
