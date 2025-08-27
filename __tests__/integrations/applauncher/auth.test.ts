import {
  getUserByUsername,
  getCurrentUser,
  createOrUpdateUser,
  isUsernameAvailable,
  validateUsername,
  type User
} from '@/integrations/applauncher/auth';

// Mock the config module
jest.mock('@/lib/config', () => ({
  USE_MOCKS: true,
  requireAppLauncherSDK: jest.fn()
}));

describe('Auth Adapter Functions', () => {
  describe('getUserByUsername', () => {
    it('should return user when username exists', async () => {
      const user = await getUserByUsername('johndoe');

      expect(user).toBeDefined();
      expect(user?.username).toBe('johndoe');
      expect(user?.email).toBe('john@example.com');
      expect(user?.displayName).toBe('John Doe');
    });

    it('should return null when username does not exist', async () => {
      const user = await getUserByUsername('nonexistentuser');

      expect(user).toBeNull();
    });

    it('should handle empty username', async () => {
      const user = await getUserByUsername('');

      expect(user).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null for current user (mock implementation)', async () => {
      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('createOrUpdateUser', () => {
    it('should create a new user when id does not exist', async () => {
      const newUserData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        bio: 'Test bio',
        avatar: 'https://example.com/avatar.jpg'
      };

      const createdUser = await createOrUpdateUser(newUserData);

      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe('testuser');
      expect(createdUser.email).toBe('test@example.com');
      expect(createdUser.displayName).toBe('Test User');
      expect(createdUser.bio).toBe('Test bio');
      expect(createdUser.avatar).toBe('https://example.com/avatar.jpg');
      expect(createdUser.id).toBeDefined();
      expect(createdUser.createdAt).toBeDefined();
      expect(createdUser.updatedAt).toBeDefined();
    });

    it('should update existing user when id exists', async () => {
      const updateData = {
        id: 'user-1',
        displayName: 'Updated John Doe',
        bio: 'Updated bio'
      };

      const updatedUser = await createOrUpdateUser(updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe('user-1');
      expect(updatedUser.displayName).toBe('Updated John Doe');
      expect(updatedUser.bio).toBe('Updated bio');
      expect(updatedUser.username).toBe('johndoe'); // Should retain original username
      expect(updatedUser.email).toBe('john@example.com'); // Should retain original email
    });

    it('should generate id when not provided', async () => {
      const newUserData = {
        username: 'anotheruser',
        email: 'another@example.com'
      };

      const createdUser = await createOrUpdateUser(newUserData);

      expect(createdUser.id).toBeDefined();
      expect(typeof createdUser.id).toBe('string');
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true for available username', async () => {
      const available = await isUsernameAvailable('availableuser');

      expect(available).toBe(true);
    });

    it('should return false for taken username', async () => {
      const available = await isUsernameAvailable('johndoe');

      expect(available).toBe(false);
    });

    it('should return true for empty username', async () => {
      const available = await isUsernameAvailable('');

      expect(available).toBe(true);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct username', () => {
      const result = validateUsername('validuser123');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject username that is too short', () => {
      const result = validateUsername('ab');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters long');
    });

    it('should reject username that is too long', () => {
      const longUsername = 'a'.repeat(21);
      const result = validateUsername(longUsername);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username must be less than 20 characters long');
    });

    it('should reject username with invalid characters', () => {
      const result = validateUsername('user@name');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, underscores, and hyphens');
    });

    it('should accept username with valid special characters', () => {
      const result = validateUsername('user_name-123');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty username', () => {
      const result = validateUsername('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should reject undefined username', () => {
      const result = validateUsername(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username is required');
    });
  });
});
