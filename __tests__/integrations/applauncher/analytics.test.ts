import {
  getAnalyticsSummary,
  getLinkStats,
  trackClick,
  type AnalyticsSummary,
  type LinkStats,
  type ClickEvent
} from '@/integrations/applauncher/analytics';

// Mock the config module
jest.mock('@/lib/config', () => ({
  USE_MOCKS: true,
  requireAppLauncherSDK: jest.fn()
}));

// Mock console.log to avoid console output during tests
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Analytics Adapter Functions', () => {
  describe('trackClick', () => {
    it('should track click event successfully', async () => {
      const clickEvent = {
        linkId: 'link-1',
        userId: 'user-1',
        referrer: 'https://google.com',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: '192.168.1.1'
      };

      await expect(trackClick(clickEvent)).resolves.not.toThrow();
    });

    it('should handle click event without optional fields', async () => {
      const clickEvent = {
        linkId: 'link-1',
        userId: 'user-1'
      };

      await expect(trackClick(clickEvent)).resolves.not.toThrow();
    });
  });

  describe('getLinkStats', () => {
    it('should return link statistics for user', async () => {
      const userId = 'user-1';
      const linkStats = await getLinkStats(userId);

      expect(Array.isArray(linkStats)).toBe(true);
      expect(linkStats.length).toBeGreaterThan(0);

      linkStats.forEach(stats => {
        expect(stats).toHaveProperty('linkId');
        expect(stats).toHaveProperty('title');
        expect(stats).toHaveProperty('url');
        expect(stats).toHaveProperty('totalClicks');
        expect(stats).toHaveProperty('uniqueClicks');
        expect(stats).toHaveProperty('totalViews');
        expect(stats).toHaveProperty('ctr');
        expect(stats).toHaveProperty('clicksByDate');
        expect(stats).toHaveProperty('topReferrers');
        expect(stats).toHaveProperty('recentClicks');

        // Check clicksByDate structure
        expect(typeof stats.clicksByDate).toBe('object');
        expect(stats.ctr).toBeGreaterThanOrEqual(0);
        expect(stats.ctr).toBeLessThanOrEqual(100);
      });
    });

    it('should return valid click data structure', async () => {
      const userId = 'user-1';
      const linkStats = await getLinkStats(userId);

      linkStats.forEach(stats => {
        // Check that clicksByDate has date keys and number values
        Object.entries(stats.clicksByDate).forEach(([date, clicks]) => {
          expect(typeof date).toBe('string');
          expect(typeof clicks).toBe('number');
          expect(clicks).toBeGreaterThanOrEqual(0);
        });

        // Check that topReferrers has referrer keys and number values
        Object.entries(stats.topReferrers).forEach(([referrer, count]) => {
          expect(typeof referrer).toBe('string');
          expect(typeof count).toBe('number');
          expect(count).toBeGreaterThanOrEqual(0);
        });

        // Check recentClicks structure
        stats.recentClicks.forEach(click => {
          expect(click).toHaveProperty('linkId');
          expect(click).toHaveProperty('userId');
          expect(click).toHaveProperty('timestamp');
          expect(click.timestamp).toBeInstanceOf(Date);
        });
      });
    });
  });

  describe('getAnalyticsSummary', () => {
    it('should return analytics summary for user', async () => {
      const userId = 'user-1';
      const summary = await getAnalyticsSummary(userId);

      expect(summary).toHaveProperty('totalViews');
      expect(summary).toHaveProperty('uniqueVisitors');
      expect(summary).toHaveProperty('totalClicks');
      expect(summary).toHaveProperty('conversionRate');
      expect(summary).toHaveProperty('clicksByDate');
      expect(summary).toHaveProperty('topLinks');

      // Check data types
      expect(typeof summary.totalViews).toBe('number');
      expect(typeof summary.uniqueVisitors).toBe('number');
      expect(typeof summary.totalClicks).toBe('number');
      expect(typeof summary.conversionRate).toBe('number');

      // Check conversion rate is between 0 and 100
      expect(summary.conversionRate).toBeGreaterThanOrEqual(0);
      expect(summary.conversionRate).toBeLessThanOrEqual(100);
    });

    it('should return valid clicksByDate structure', async () => {
      const userId = 'user-1';
      const summary = await getAnalyticsSummary(userId);

      // Check that clicksByDate has date keys and number values
      Object.entries(summary.clicksByDate).forEach(([date, clicks]) => {
        expect(typeof date).toBe('string');
        expect(typeof clicks).toBe('number');
        expect(clicks).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return valid topLinks structure', async () => {
      const userId = 'user-1';
      const summary = await getAnalyticsSummary(userId);

      expect(Array.isArray(summary.topLinks)).toBe(true);
      expect(summary.topLinks.length).toBeGreaterThan(0);

      summary.topLinks.forEach(link => {
        expect(link).toHaveProperty('linkId');
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('totalClicks');
        expect(link).toHaveProperty('ctr');

        expect(typeof link.totalClicks).toBe('number');
        expect(typeof link.ctr).toBe('number');
        expect(link.ctr).toBeGreaterThanOrEqual(0);
        expect(link.ctr).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate correct totals', async () => {
      const userId = 'user-1';
      const summary = await getAnalyticsSummary(userId);
      const linkStats = await getLinkStats(userId);

      // Total views should match sum of individual link views
      const expectedTotalViews = linkStats.reduce((sum, link) => sum + link.totalViews, 0);
      expect(summary.totalViews).toBe(expectedTotalViews);

      // Total clicks should match sum of individual link clicks
      const expectedTotalClicks = linkStats.reduce((sum, link) => sum + link.totalClicks, 0);
      expect(summary.totalClicks).toBe(expectedTotalClicks);
    });

    it('should sort topLinks by clicks', async () => {
      const userId = 'user-1';
      const summary = await getAnalyticsSummary(userId);

      // Check that topLinks are sorted by totalClicks in descending order
      for (let i = 0; i < summary.topLinks.length - 1; i++) {
        expect(summary.topLinks[i].totalClicks).toBeGreaterThanOrEqual(summary.topLinks[i + 1].totalClicks);
      }
    });
  });
});
