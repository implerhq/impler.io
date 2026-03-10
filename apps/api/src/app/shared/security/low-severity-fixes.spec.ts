import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();
const API_SRC = path.join(ROOT, 'apps/api/src');

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf-8');
}

describe('LOW Severity Security Fixes', () => {
  describe('Bootstrap Security Headers', () => {
    let bootstrapContent: string;
    before(() => {
      bootstrapContent = readFile('apps/api/src/bootstrap.ts');
    });

    it('should have X-Powered-By disabled in bootstrap config', () => {
      expect(bootstrapContent).to.include("disable('x-powered-by')");
    });

    it('should include Permissions-Policy header', () => {
      expect(bootstrapContent).to.include('Permissions-Policy');
      expect(bootstrapContent).to.include('camera=()');
      expect(bootstrapContent).to.include('microphone=()');
      expect(bootstrapContent).to.include('geolocation=()');
    });

    it('should include CORS maxAge for preflight caching', () => {
      expect(bootstrapContent).to.include('maxAge: 86400');
    });

    it('should include X-Content-Type-Options header', () => {
      expect(bootstrapContent).to.include('X-Content-Type-Options');
      expect(bootstrapContent).to.include('nosniff');
    });

    it('should include X-Frame-Options DENY header', () => {
      expect(bootstrapContent).to.include("'X-Frame-Options', 'DENY'");
    });

    it('should include Referrer-Policy header', () => {
      expect(bootstrapContent).to.include('Referrer-Policy');
      expect(bootstrapContent).to.include('strict-origin-when-cross-origin');
    });
  });

  describe('Auth Guard File Rename', () => {
    it('should have auth.guard.ts file (not auth.gaurd.ts)', () => {
      const guardPath = path.join(API_SRC, 'app/shared/framework/auth.guard.ts');
      const oldPath = path.join(API_SRC, 'app/shared/framework/auth.gaurd.ts');

      expect(fs.existsSync(guardPath)).to.be.true;
      expect(fs.existsSync(oldPath)).to.be.false;
    });

    it('should have controllers importing from auth.guard (not auth.gaurd)', () => {
      const controllersDir = path.join(API_SRC, 'app');

      function findControllerFiles(dir: string): string[] {
        const files: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.includes('node_modules')) {
            files.push(...findControllerFiles(fullPath));
          } else if (entry.name.endsWith('.controller.ts')) {
            files.push(fullPath);
          }
        }

        return files;
      }

      const controllerFiles = findControllerFiles(controllersDir);
      expect(controllerFiles.length).to.be.greaterThan(0);
      for (const file of controllerFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('auth.gaurd')) {
          throw new Error(`File ${file} still imports from auth.gaurd`);
        }
      }
    });
  });

  describe('WebSocket Authentication', () => {
    let wsContent: string;
    before(() => {
      wsContent = readFile('apps/api/src/app/shared/services/websocket-service/websocket.service.ts');
    });

    it('should import JwtService in WebSocket service', () => {
      expect(wsContent).to.include("import { JwtService } from '@nestjs/jwt'");
    });

    it('should verify JWT token on WebSocket connection', () => {
      expect(wsContent).to.include('jwtService.verify');
      expect(wsContent).to.include('client.handshake');
    });

    it('should disconnect unauthorized clients', () => {
      expect(wsContent).to.include('client.disconnect(true)');
      expect(wsContent).to.include('auth-error');
    });

    it('should validate session ID format in join-session', () => {
      expect(wsContent).to.include('/^[a-zA-Z0-9_-]+$/');
      expect(wsContent).to.include('sessionId.length > 128');
    });
  });

  describe('NestJS Logger Usage', () => {
    it('should use NestJS Logger in failed-webhook-retry usecase', () => {
      const content = readFile(
        'apps/api/src/app/failed-webhook-request-retry/usecase/failed-webhook-request-retry.usecase.ts'
      );
      expect(content).to.include("import { Injectable, Logger } from '@nestjs/common'");
      expect(content).to.include('private readonly logger = new Logger(');
      expect(content).to.include('this.logger.log(');
      expect(content).to.include('this.logger.error(');
      expect(content).not.to.include('console.log(');
      expect(content).not.to.include('console.error(');
    });

    it('should use NestJS Logger in upload-cleanup-scheduler', () => {
      const content = readFile(
        'apps/api/src/app/upload/usecases/uploadcleanup-scheduler/uploadcleanup-scheduler.service.ts'
      );
      expect(content).to.include("import { Injectable, Logger } from '@nestjs/common'");
      expect(content).to.include('private readonly logger = new Logger(');
      expect(content).to.include('this.logger.log(');
      expect(content).not.to.include('console.log(');
      expect(content).not.to.include('console.error(');
    });

    it('should use NestJS Logger in auth controller', () => {
      const content = readFile('apps/api/src/app/auth/auth.controller.ts');
      expect(content).to.include('Logger');
      expect(content).to.include('this.logger.error');
      expect(content).not.to.include('console.error(');
    });
  });

  describe('Error Response Normalization', () => {
    let filterContent: string;
    before(() => {
      filterContent = readFile('apps/api/src/app/shared/filters/exception.filter.ts');
    });

    it('should normalize error responses in production in exception filter', () => {
      expect(filterContent).to.include("process.env.NODE_ENV === 'production'");
      expect(filterContent).to.include("message: 'Internal server error'");
      expect(filterContent).to.include('statusCode: 500');
    });

    it('should still report to Sentry before normalizing', () => {
      expect(filterContent).to.include('Sentry.captureException(exception)');
    });
  });

  describe('TypeScript Configuration', () => {
    let tsConfig: any;
    before(() => {
      tsConfig = JSON.parse(readFile('tsconfig.base.json'));
    });

    it('should target es2020 or later', () => {
      const target = tsConfig.compilerOptions.target.toLowerCase();
      expect(['es2020', 'es2021', 'es2022', 'esnext']).to.include(target);
    });

    it('should use es2020 lib or later', () => {
      const libs = tsConfig.compilerOptions.lib.map((l: string) => l.toLowerCase());
      expect(libs.some((l: string) => ['es2020', 'es2021', 'es2022', 'esnext'].includes(l))).to.be.true;
    });
  });
});
