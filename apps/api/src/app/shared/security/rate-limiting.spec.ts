import { expect } from 'chai';

describe('Rate Limiting Tests', () => {
  describe('In-Memory Rate Limiter', () => {
    const RATE_LIMIT_WINDOW_MS = 60 * 1000;
    const RATE_LIMIT_MAX = 200;
    const AUTH_RATE_LIMIT_MAX = 20;

    const store = new Map<string, { count: number; resetTime: number }>();

    function checkRateLimit(ip: string, isAuthRoute: boolean): boolean {
      const maxRequests = isAuthRoute ? AUTH_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
      const key = `${ip}:${isAuthRoute ? 'auth' : 'general'}`;
      const now = Date.now();

      const record = store.get(key);
      if (!record || now > record.resetTime) {
        store.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });

        return true;
      } else {
        record.count += 1;

        return record.count <= maxRequests;
      }
    }

    beforeEach(() => {
      store.clear();
    });

    it('should allow requests under the general limit', () => {
      for (let i = 0; i < RATE_LIMIT_MAX; i++) {
        expect(checkRateLimit('192.168.1.1', false)).to.equal(true);
      }
    });

    it('should block requests exceeding general limit', () => {
      for (let i = 0; i < RATE_LIMIT_MAX; i++) {
        checkRateLimit('192.168.1.1', false);
      }
      expect(checkRateLimit('192.168.1.1', false)).to.equal(false);
    });

    it('should have stricter limit for auth routes (20 vs 200)', () => {
      for (let i = 0; i < AUTH_RATE_LIMIT_MAX; i++) {
        expect(checkRateLimit('192.168.1.1', true)).to.equal(true);
      }
      expect(checkRateLimit('192.168.1.1', true)).to.equal(false);
    });

    it('should track different IPs independently', () => {
      for (let i = 0; i < RATE_LIMIT_MAX; i++) {
        checkRateLimit('10.0.0.1', false);
      }
      // IP 10.0.0.1 is now rate-limited
      expect(checkRateLimit('10.0.0.1', false)).to.equal(false);
      // IP 10.0.0.2 should still be allowed
      expect(checkRateLimit('10.0.0.2', false)).to.equal(true);
    });

    it('should track auth and general routes independently for same IP', () => {
      for (let i = 0; i < AUTH_RATE_LIMIT_MAX; i++) {
        checkRateLimit('192.168.1.1', true);
      }
      // Auth is rate-limited
      expect(checkRateLimit('192.168.1.1', true)).to.equal(false);
      // General should still be allowed
      expect(checkRateLimit('192.168.1.1', false)).to.equal(true);
    });

    it('should reset after window expires', () => {
      const key = '192.168.1.1:general';
      store.set(key, { count: RATE_LIMIT_MAX + 1, resetTime: Date.now() - 1 });
      // After expiry, should allow again
      expect(checkRateLimit('192.168.1.1', false)).to.equal(true);
    });
  });
});
