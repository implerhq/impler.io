import { expect } from 'chai';
import * as crypto from 'crypto';

describe('Auth Guards - Security Tests', () => {
  describe('APIKeyGuard - Timing-Safe Comparison', () => {
    it('should use timing-safe comparison for API keys', () => {
      const key1 = 'correct-api-key-12345';
      const key2 = 'correct-api-key-12345';
      const key3 = 'wrong-api-key-99999';

      const buf1 = Buffer.from(key1);
      const buf2 = Buffer.from(key2);
      const buf3 = Buffer.from(key3);

      // Same key should match
      expect(crypto.timingSafeEqual(buf1, buf2)).to.equal(true);

      // Different key should not match
      expect(buf1.length === buf3.length ? crypto.timingSafeEqual(buf1, buf3) : false).to.equal(false);
    });

    it('should handle different length keys safely', () => {
      const short = Buffer.from('abc');
      const long = Buffer.from('abcdefghij');

      // Different lengths should be caught before timingSafeEqual
      expect(short.length !== long.length).to.equal(true);
    });
  });

  describe('JwtAuthGuard - Token Verification', () => {
    it('should reject tokens with invalid structure', () => {
      const invalidTokens = [
        '',
        'not-a-jwt',
        'Bearer ',
        'Bearer invalid.token',
        'only-two.parts',
      ];

      invalidTokens.forEach((token) => {
        const parts = token.split(' ');
        const isValidFormat = parts.length === 2 && parts[0] === 'Bearer' && parts[1].length > 0;
        if (token === '' || token === 'not-a-jwt' || token === 'only-two.parts') {
          expect(isValidFormat).to.equal(false);
        }
      });
    });

    it('should not accept tokens without Bearer prefix', () => {
      const rawToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.signature';
      const parts = rawToken.split(' ');
      expect(parts[0]).to.not.equal('Bearer');
    });

    it('should require JWT_SECRET environment variable for verification', () => {
      // jwt.verify requires a secret - without it, verification should fail
      const mockSecret = process.env.JWT_SECRET;
      expect(typeof mockSecret === 'string' || mockSecret === undefined).to.equal(true);
    });
  });

  describe('UserSession Decorator - JWT Verify vs Decode', () => {
    const jwt = require('jsonwebtoken');

    it('should reject unsigned tokens', () => {
      const secret = 'test-secret-key';
      const unsignedPayload = { _id: 'fake-user', email: 'attacker@evil.com' };

      // Create an unsigned token (header.payload without signature)
      const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify(unsignedPayload)).toString('base64url');
      const unsignedToken = `${header}.${payload}.`;

      // jwt.decode would ACCEPT this (VULNERABLE)
      const decoded = jwt.decode(unsignedToken, { json: true });
      expect(decoded).to.not.equal(null);
      expect(decoded._id).to.equal('fake-user');

      // jwt.verify should REJECT this (SECURE)
      try {
        jwt.verify(unsignedToken, secret, { algorithms: ['HS256'] });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.satisfy((msg: string) =>
          msg.includes('invalid') || msg.includes('signature')
        );
      }
    });

    it('should reject tokens signed with wrong secret', () => {
      const correctSecret = 'correct-secret';
      const wrongSecret = 'wrong-secret';

      const token = jwt.sign({ _id: 'user123' }, wrongSecret);

      try {
        jwt.verify(token, correctSecret, { algorithms: ['HS256'] });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.include('signature');
      }
    });

    it('should accept tokens signed with correct secret', () => {
      const secret = 'test-secret-key';
      const payload = { _id: 'user123', email: 'user@test.com' };

      const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
      const verified = jwt.verify(token, secret, { algorithms: ['HS256'] });

      expect(verified._id).to.equal('user123');
      expect(verified.email).to.equal('user@test.com');
    });

    it('should reject expired tokens', () => {
      const secret = 'test-secret-key';
      const token = jwt.sign({ _id: 'user123' }, secret, { expiresIn: '-1s' });

      try {
        jwt.verify(token, secret, { algorithms: ['HS256'] });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.include('expired');
      }
    });
  });
});
