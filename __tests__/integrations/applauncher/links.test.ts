import {
  listLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  AVAILABLE_ICONS,
  type Link
} from '@/integrations/applauncher/links';

// Mock the config module
jest.mock('@/lib/config', () => ({
  USE_MOCKS: true,
  requireAppLauncherSDK: jest.fn()
}));

describe('Links Adapter Functions', () => {
  describe('listLinks', () => {
    it('should return all links ordered by order field', async () => {
      const links = await listLinks();

      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);

      // Check that links are ordered by order field
      for (let i = 0; i < links.length - 1; i++) {
        expect(links[i].order).toBeLessThanOrEqual(links[i + 1].order);
      }

      // Check link structure
      links.forEach(link => {
        expect(link).toHaveProperty('id');
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('icon');
        expect(link).toHaveProperty('isPremium');
        expect(link).toHaveProperty('isVisible');
        expect(link).toHaveProperty('order');
        expect(link).toHaveProperty('createdAt');
        expect(link).toHaveProperty('updatedAt');
      });
    });
  });

  describe('createLink', () => {
    it('should create a new link with required fields', async () => {
      const linkData = {
        title: 'Test Link',
        url: 'https://test.com',
        isPremium: false,
        isVisible: true,
        order: 10
      };

      const createdLink = await createLink(linkData);

      expect(createdLink).toBeDefined();
      expect(createdLink.title).toBe('Test Link');
      expect(createdLink.url).toBe('https://test.com');
      expect(createdLink.isPremium).toBe(false);
      expect(createdLink.isVisible).toBe(true);
      expect(createdLink.order).toBe(10);
      expect(createdLink.id).toBeDefined();
      expect(createdLink.createdAt).toBeDefined();
      expect(createdLink.updatedAt).toBeDefined();
    });

    it('should create link with default values', async () => {
      const linkData = {
        title: 'Default Link',
        url: 'https://default.com',
        isPremium: false,
        isVisible: true,
        order: 0
      };

      const createdLink = await createLink(linkData);

      expect(createdLink.icon).toBe('globe'); // Default icon
    });

    it('should create link with custom icon', async () => {
      const linkData = {
        title: 'Custom Icon Link',
        url: 'https://custom.com',
        icon: 'github',
        isPremium: false,
        isVisible: true,
        order: 0
      };

      const createdLink = await createLink(linkData);

      expect(createdLink.icon).toBe('github');
    });
  });

  describe('updateLink', () => {
    it('should update existing link', async () => {
      const linkData = {
        title: 'Test Update Link',
        url: 'https://test-update.com',
        isPremium: false,
        isVisible: true,
        order: 0
      };

      const createdLink = await createLink(linkData);
      const updateData = {
        title: 'Updated Title',
        isPremium: true
      };

      const updatedLink = await updateLink(createdLink.id, updateData);

      expect(updatedLink.title).toBe('Updated Title');
      expect(updatedLink.isPremium).toBe(true);
      expect(updatedLink.url).toBe('https://test-update.com'); // Unchanged
      expect(updatedLink.updatedAt).not.toBe(createdLink.updatedAt); // Should be updated
    });

    it('should throw error for non-existent link', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      await expect(updateLink('non-existent-id', updateData)).rejects.toThrow('Link not found');
    });
  });

  describe('deleteLink', () => {
    it('should delete existing link', async () => {
      const linkData = {
        title: 'Link to Delete',
        url: 'https://delete.com',
        isPremium: false,
        isVisible: true,
        order: 0
      };

      const createdLink = await createLink(linkData);
      const linksBefore = await listLinks();

      await deleteLink(createdLink.id);
      const linksAfter = await listLinks();

      expect(linksAfter.length).toBe(linksBefore.length - 1);
      expect(linksAfter.find(link => link.id === createdLink.id)).toBeUndefined();
    });

    it('should throw error for non-existent link', async () => {
      await expect(deleteLink('non-existent-id')).rejects.toThrow('Link not found');
    });
  });

  describe('reorderLinks', () => {
    it('should reorder links correctly', async () => {
      const links = await listLinks();
      const originalOrder = links.map(link => link.id);
      const newOrder = [...originalOrder].reverse(); // Reverse the order

      await reorderLinks(newOrder);

      const reorderedLinks = await listLinks();

      // Check that the first link now has the last original ID
      expect(reorderedLinks[0].id).toBe(originalOrder[originalOrder.length - 1]);
      // Check that the last link now has the first original ID
      expect(reorderedLinks[reorderedLinks.length - 1].id).toBe(originalOrder[0]);

      // Check that order fields are sequential
      reorderedLinks.forEach((link, index) => {
        expect(link.order).toBe(index);
      });
    });

    it('should handle empty array', async () => {
      await expect(reorderLinks([])).resolves.not.toThrow();
    });
  });

  describe('AVAILABLE_ICONS', () => {
    it('should be an array of strings', () => {
      expect(Array.isArray(AVAILABLE_ICONS)).toBe(true);
      expect(AVAILABLE_ICONS.length).toBeGreaterThan(0);
      expect(AVAILABLE_ICONS.every(icon => typeof icon === 'string')).toBe(true);
    });

    it('should contain expected icons', () => {
      expect(AVAILABLE_ICONS).toContain('github');
      expect(AVAILABLE_ICONS).toContain('globe');
      expect(AVAILABLE_ICONS).toContain('linkedin');
      expect(AVAILABLE_ICONS).toContain('twitter');
    });
  });
});
