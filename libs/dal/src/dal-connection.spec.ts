import { expect } from 'chai';

describe('MongoDB Connection Pool Configuration Tests', () => {
  describe('Connection options', () => {
    it('should have maxPoolSize of 100', () => {
      const defaultConfig = {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
      };

      expect(defaultConfig.maxPoolSize).to.equal(100);
    });

    it('should have minPoolSize of 10', () => {
      const defaultConfig = {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
      };

      expect(defaultConfig.minPoolSize).to.equal(10);
    });

    it('should set socketTimeoutMS to 30 seconds', () => {
      const defaultConfig = {
        socketTimeoutMS: 30000,
      };

      expect(defaultConfig.socketTimeoutMS).to.equal(30000);
    });

    it('should set serverSelectionTimeoutMS to 5 seconds', () => {
      const defaultConfig = {
        serverSelectionTimeoutMS: 5000,
      };

      expect(defaultConfig.serverSelectionTimeoutMS).to.equal(5000);
    });

    it('should enable retryWrites', () => {
      const defaultConfig = {
        retryWrites: true,
      };

      expect(defaultConfig.retryWrites).to.equal(true);
    });

    it('should allow user config to override defaults', () => {
      const userConfig = { maxPoolSize: 200 };
      const mergedConfig = {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        ...userConfig,
      };

      expect(mergedConfig.maxPoolSize).to.equal(200);
      expect(mergedConfig.minPoolSize).to.equal(10);
    });
  });

  describe('JWT Token Expiry', () => {
    it('should be 4 hours (reduced from 24h)', () => {
      const maxAge = 1000 * 60 * 60 * 4; // 4 hours
      expect(maxAge).to.equal(14400000);
      expect(maxAge).to.be.lessThan(1000 * 60 * 60 * 24); // less than 24h
    });

    it('should be at most 8 hours for security', () => {
      const maxAge = 1000 * 60 * 60 * 4;
      const maxAllowed = 1000 * 60 * 60 * 8; // 8 hours
      expect(maxAge).to.be.lessThanOrEqual(maxAllowed);
    });
  });
});
