import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf-8');
}

describe('Secondary Vulnerability Fixes', () => {
  describe('GitHub OAuth Prototype Pollution Prevention', () => {
    let strategyContent: string;
    before(() => {
      strategyContent = readFile('apps/api/src/app/auth/services/passport/github.strategy.ts');
    });

    it('should filter __proto__ from OAuth query state store', () => {
      expect(strategyContent).to.include("'__proto__'");
      expect(strategyContent).to.include("'constructor'");
      expect(strategyContent).to.include("'prototype'");
    });

    it('should use safeJsonParse with dangerous key filtering in parseState', () => {
      expect(strategyContent).to.include('DANGEROUS_KEYS');
      expect(strategyContent).to.include('JSON.parse(req.query.state, (key, value)');
    });

    it('should filter dangerous keys in both store and verify callbacks', () => {
      const filterCount = (strategyContent.match(/Object\.fromEntries/g) || []).length;
      expect(filterCount).to.be.at.least(2);
    });

    it('should return empty object on parse failure', () => {
      expect(strategyContent).to.include('return {};');
    });
  });

  describe('ReDoS Prevention - Bubble.io Email Regex', () => {
    it('should use non-backtracking email regex', () => {
      const content = readFile('apps/api/src/app/shared/services/bubble-io.service.ts');
      // Should NOT contain the vulnerable nested quantifier pattern
      expect(content).to.not.include("([\\.\\-]?\\w+)*@\\w+([\\.\\-]?\\w+)*");
      // Should contain a simpler pattern
      expect(content).to.include('[^\\s@]+@[^\\s@]+');
    });

    it('simpler email regex should still match valid emails', () => {
      const safeRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      expect(safeRegex.test('user@example.com')).to.be.true;
      expect(safeRegex.test('test.user@domain.org')).to.be.true;
      expect(safeRegex.test('a@b.co')).to.be.true;
    });

    it('simpler email regex should reject invalid emails', () => {
      const safeRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      expect(safeRegex.test('notanemail')).to.be.false;
      expect(safeRegex.test('@missing.com')).to.be.false;
      expect(safeRegex.test('spaces in@email.com')).to.be.false;
    });
  });

  describe('WebSocket Session ID - Minimum Length', () => {
    it('should enforce minimum session ID length of 6', () => {
      const content = readFile('apps/api/src/app/shared/services/websocket-service/websocket.service.ts');
      expect(content).to.include('sessionId.length < 6');
    });

    it('should still enforce maximum length of 128', () => {
      const content = readFile('apps/api/src/app/shared/services/websocket-service/websocket.service.ts');
      expect(content).to.include('sessionId.length > 128');
    });
  });

  describe('Cron DTO MaxLength Validation', () => {
    it('should have MaxLength on create-userjob cron field', () => {
      const content = readFile('apps/api/src/app/import-jobs/dtos/create-userjob.dto.ts');
      // Find the cron field section and verify MaxLength is before Matches
      const cronIdx = content.indexOf('cron?: string');
      const sectionBefore = content.substring(Math.max(0, cronIdx - 300), cronIdx);
      expect(sectionBefore).to.include('@MaxLength(120)');
    });

    it('should have MaxLength on update-userjob cron field', () => {
      const content = readFile('apps/api/src/app/import-jobs/dtos/update-userjob.dto.ts');
      const cronIdx = content.indexOf('cron: string');
      const sectionBefore = content.substring(Math.max(0, cronIdx - 300), cronIdx);
      expect(sectionBefore).to.include('@MaxLength(120)');
    });
  });
});
