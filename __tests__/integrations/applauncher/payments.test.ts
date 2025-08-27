import {
  getBillingSummary,
  createTipSession,
  createSubscriptionSession,
  unlockPremiumLink,
  type BillingSummary
} from '@/integrations/applauncher/payments';

// Mock the config module
jest.mock('@/lib/config', () => ({
  USE_MOCKS: true,
  requireAppLauncherSDK: jest.fn()
}));

// Mock alert function for tests
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('Payments Adapter Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getBillingSummary', () => {
    it('should return billing summary for user', async () => {
      const userId = 'user-1';
      const summary = await getBillingSummary(userId);

      expect(summary).toHaveProperty('totalEarned');
      expect(summary).toHaveProperty('activeSubscribers');

      expect(typeof summary.totalEarned).toBe('number');
      expect(typeof summary.activeSubscribers).toBe('number');

      expect(summary.totalEarned).toBeGreaterThanOrEqual(0);
      expect(summary.activeSubscribers).toBeGreaterThanOrEqual(0);
    });

    it('should return valid structure', async () => {
      const userId = 'user-1';
      const summary = await getBillingSummary(userId);

      // Should have expected properties with correct types
      expect(summary).toEqual(
        expect.objectContaining({
          totalEarned: expect.any(Number),
          activeSubscribers: expect.any(Number)
        })
      );
    });
  });

  describe('createTipSession', () => {
    it('should create tip session successfully', async () => {
      const userId = 'user-1';
      const tipSession = await createTipSession(userId);

      expect(tipSession).toHaveProperty('url');
      expect(typeof tipSession.url).toBe('string');
      expect(tipSession.url.length).toBeGreaterThan(0);
    });

    it('should return valid tip session structure', async () => {
      const userId = 'user-1';
      const tipSession = await createTipSession(userId);

      expect(tipSession).toEqual(
        expect.objectContaining({
          url: expect.any(String)
        })
      );
    });
  });

  describe('createSubscriptionSession', () => {
    it('should create subscription session successfully', async () => {
      const userId = 'user-1';
      const subscriptionSession = await createSubscriptionSession(userId);

      expect(subscriptionSession).toHaveProperty('url');
      expect(typeof subscriptionSession.url).toBe('string');
      expect(subscriptionSession.url.length).toBeGreaterThan(0);
    });

    it('should return valid subscription session structure', async () => {
      const userId = 'user-1';
      const subscriptionSession = await createSubscriptionSession(userId);

      expect(subscriptionSession).toEqual(
        expect.objectContaining({
          url: expect.any(String)
        })
      );
    });
  });

  describe('unlockPremiumLink', () => {
    it('should unlock premium link successfully', async () => {
      const linkId = 'link-3'; // Premium link from mock data
      const userId = 'user-1';

      // This should not throw in mock mode
      await expect(unlockPremiumLink(linkId, userId)).resolves.not.toThrow();
    });

    it('should handle non-premium links', async () => {
      const linkId = 'link-1'; // Regular link from mock data
      const userId = 'user-1';

      // This should not throw in mock mode
      await expect(unlockPremiumLink(linkId, userId)).resolves.not.toThrow();
    });
  });

  describe('Integration between functions', () => {
    it('should handle complete payment flow', async () => {
      const userId = 'user-1';

      // Get initial billing summary
      const initialSummary = await getBillingSummary(userId);
      expect(initialSummary.totalEarned).toBeDefined();

      // Create tip session
      const tipSession = await createTipSession(userId);
      expect(tipSession.url).toBeDefined();

      // Create subscription session
      const subscriptionSession = await createSubscriptionSession(userId);
      expect(subscriptionSession.url).toBeDefined();

      // Unlock premium link
      const linkId = 'link-3';
      await expect(unlockPremiumLink(linkId, userId)).resolves.not.toThrow();
    });
  });
});
