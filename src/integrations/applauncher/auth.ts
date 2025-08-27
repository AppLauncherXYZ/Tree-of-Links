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
  // For demo purposes, we'll simulate a new user session
  // In a real app, this would check the current session/token
  return null; // Return null to trigger onboarding for new users
}

/**
 * Create or update a user
 * TODO: Replace with AppLauncher SDK authentication
 */
export async function createOrUpdateUser(userData: Partial<User>): Promise<User> {
  // Mock implementation - replace with AppLauncher SDK
  const existingUserIndex = mockUsers.findIndex(user => user.id === userData.id);

  if (existingUserIndex >= 0) {
    // Update existing user
    mockUsers[existingUserIndex] = {
      ...mockUsers[existingUserIndex],
      ...userData
    };
    return mockUsers[existingUserIndex];
  } else {
    // Create new user
    const newUser: User = {
      id: userData.id || `user-${Date.now()}`,
      username: userData.username || '',
      email: userData.email || '',
      displayName: userData.displayName || '',
      bio: userData.bio || '',
      avatar: userData.avatar || ''
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

/**
 * Check if username is available
 * TODO: Replace with AppLauncher SDK authentication
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  // Mock implementation - replace with AppLauncher SDK
  return !mockUsers.some(user => user.username === username);
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters long' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { isValid: true };
}
