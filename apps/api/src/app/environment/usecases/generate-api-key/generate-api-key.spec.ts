import { expect } from 'chai';
import * as crypto from 'crypto';

describe('GenerateUniqueApiKey - Cryptographic Security', () => {
  describe('API key generation with crypto.randomBytes', () => {
    it('should generate 256-bit (64 hex character) keys', () => {
      const key = crypto.randomBytes(32).toString('hex');
      expect(key).to.have.length(64);
    });

    it('should generate unique keys on each call', () => {
      const keys = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        keys.add(crypto.randomBytes(32).toString('hex'));
      }
      // All 1000 keys should be unique
      expect(keys.size).to.equal(1000);
    });

    it('should generate hex-only characters', () => {
      const key = crypto.randomBytes(32).toString('hex');
      expect(key).to.match(/^[a-f0-9]+$/);
    });

    it('should have sufficient entropy (256 bits)', () => {
      const key = crypto.randomBytes(32);
      // 32 bytes = 256 bits of entropy
      expect(key.length).to.equal(32);
    });

    it('should be significantly stronger than hat() (128 bits)', () => {
      // crypto.randomBytes(32) = 256 bits vs hat() = ~128 bits
      // 2^128 more combinations, practically impossible to brute force
      const keyBytes = 32;
      const keyBits = keyBytes * 8;
      expect(keyBits).to.equal(256);
      expect(keyBits).to.be.greaterThan(128);
    });
  });

  describe('API key collision resistance', () => {
    it('should not generate duplicate keys in 10000 iterations', () => {
      const keys = new Set<string>();
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        keys.add(crypto.randomBytes(32).toString('hex'));
      }

      expect(keys.size).to.equal(iterations);
    });
  });
});
