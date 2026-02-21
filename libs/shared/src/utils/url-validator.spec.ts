import { expect } from 'chai';
import { isUrlSafeForServerRequest, validateWebhookUrl, sanitizePaginationParams, MAX_PAGINATION_LIMIT } from './url-validator';

describe('URL Validator - SSRF Protection', () => {
  describe('isUrlSafeForServerRequest', () => {
    it('should allow valid public HTTPS URLs', () => {
      expect(isUrlSafeForServerRequest('https://example.com/webhook')).to.equal(true);
      expect(isUrlSafeForServerRequest('https://api.stripe.com/v1/charges')).to.equal(true);
      expect(isUrlSafeForServerRequest('https://hooks.slack.com/services/T00/B00/XXX')).to.equal(true);
    });

    it('should allow valid public HTTP URLs', () => {
      expect(isUrlSafeForServerRequest('http://example.com/webhook')).to.equal(true);
    });

    it('should block localhost variants', () => {
      expect(isUrlSafeForServerRequest('http://localhost/admin')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://localhost:3000/api')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://127.0.0.1/secret')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://127.0.0.1:27017')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://0.0.0.0/admin')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://[::1]/admin')).to.equal(false);
    });

    it('should block private IPv4 ranges (10.x.x.x)', () => {
      expect(isUrlSafeForServerRequest('http://10.0.0.1/internal')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://10.255.255.255')).to.equal(false);
    });

    it('should block private IPv4 ranges (172.16-31.x.x)', () => {
      expect(isUrlSafeForServerRequest('http://172.16.0.1/internal')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://172.31.255.255')).to.equal(false);
      // 172.32.x.x should be allowed
      expect(isUrlSafeForServerRequest('http://172.32.0.1')).to.equal(true);
    });

    it('should block private IPv4 ranges (192.168.x.x)', () => {
      expect(isUrlSafeForServerRequest('http://192.168.0.1/internal')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://192.168.1.100:8080')).to.equal(false);
    });

    it('should block AWS metadata endpoint (169.254.x.x)', () => {
      expect(isUrlSafeForServerRequest('http://169.254.169.254/latest/meta-data/')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://169.254.169.254/latest/api/token')).to.equal(false);
    });

    it('should block cloud metadata hostnames', () => {
      expect(isUrlSafeForServerRequest('http://metadata.google.internal/computeMetadata/v1/')).to.equal(false);
      expect(isUrlSafeForServerRequest('http://metadata.google.com')).to.equal(false);
    });

    it('should block non-HTTP protocols', () => {
      expect(isUrlSafeForServerRequest('ftp://example.com/file')).to.equal(false);
      expect(isUrlSafeForServerRequest('file:///etc/passwd')).to.equal(false);
      expect(isUrlSafeForServerRequest('gopher://evil.com')).to.equal(false);
      expect(isUrlSafeForServerRequest('javascript:alert(1)')).to.equal(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isUrlSafeForServerRequest('')).to.equal(false);
      expect(isUrlSafeForServerRequest('not-a-url')).to.equal(false);
      expect(isUrlSafeForServerRequest('://missing-protocol')).to.equal(false);
    });
  });

  describe('validateWebhookUrl', () => {
    it('should return null for valid webhook URLs', () => {
      expect(validateWebhookUrl('https://example.com/webhook')).to.equal(null);
    });

    it('should return error for empty URL', () => {
      expect(validateWebhookUrl('')).to.equal('URL is required');
      expect(validateWebhookUrl(null as any)).to.equal('URL is required');
      expect(validateWebhookUrl(undefined as any)).to.equal('URL is required');
    });

    it('should return error for invalid URL format', () => {
      expect(validateWebhookUrl('not-a-url')).to.equal('Invalid URL format');
    });

    it('should return error for restricted URLs', () => {
      const result = validateWebhookUrl('http://localhost:3000/admin');
      expect(result).to.include('restricted');
    });
  });

  describe('sanitizePaginationParams', () => {
    it('should return valid pagination params unchanged', () => {
      const result = sanitizePaginationParams(1, 10);
      expect(result.page).to.equal(1);
      expect(result.limit).to.equal(10);
    });

    it('should clamp limit to MAX_PAGINATION_LIMIT', () => {
      const result = sanitizePaginationParams(1, 999999);
      expect(result.limit).to.equal(MAX_PAGINATION_LIMIT);
    });

    it('should enforce minimum page of 1', () => {
      const result = sanitizePaginationParams(-5, 10);
      expect(result.page).to.equal(1);
    });

    it('should enforce minimum limit of 1', () => {
      const result = sanitizePaginationParams(1, -10);
      expect(result.limit).to.equal(1);
    });

    it('should handle NaN inputs gracefully', () => {
      const result = sanitizePaginationParams(NaN, NaN);
      expect(result.page).to.equal(1);
      expect(result.limit).to.equal(10);
    });

    it('should floor floating point numbers', () => {
      const result = sanitizePaginationParams(2.7, 15.9);
      expect(result.page).to.equal(2);
      expect(result.limit).to.equal(15);
    });
  });
});
