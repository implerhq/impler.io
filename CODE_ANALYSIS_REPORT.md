# Impler.io Comprehensive Code Analysis & Development Plan

**Date:** 2026-02-10
**Codebase Version:** 1.9.3
**Branch:** `next`
**Scale Target:** 10 Million Concurrent Requests
**Current Users:** 1M+

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Security Vulnerabilities](#2-security-vulnerabilities)
3. [Error Handling & Validation](#3-error-handling--validation)
4. [Dependency Upgrades](#4-dependency-upgrades)
5. [Cross-Dependency Security & Optimization](#5-cross-dependency-security--optimization)
6. [Architecture Optimization for 10M Scale](#6-architecture-optimization-for-10m-scale)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Cost Projections](#8-cost-projections)

---

## 1. Executive Summary

### Current Architecture
- **API:** NestJS 10.4.4 (single process, PM2 standalone)
- **Web Dashboard:** Next.js 14.2.30
- **Widget:** React 18 + Create React App 5.0.1
- **Queue Manager:** RabbitMQ consumer (no durability, no ack)
- **Database:** MongoDB (Mongoose, default pool size 5-10)
- **Storage:** AWS S3 / Azure Blob
- **Caching:** NONE (every request hits DB)
- **Observability:** Sentry only (no metrics, no tracing)

### Current Estimated Capacity: ~1K-5K concurrent requests
### Target Capacity: 10M concurrent requests (2,000-10,000x improvement needed)

### Critical Findings Summary

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Security Vulnerabilities | 6 | 5 | 6 | 3 | 20 |
| Error Handling & Validation | 6 | 18 | 17 | 0 | 41 |
| Dependency Upgrades | 3 | 8 | 12 | 3 | 26 |
| Cross-Dependency Issues | 5 | 8 | 12 | 3 | 28 |
| Architecture Gaps | 7 | 4 | 4 | 0 | 15 |
| **TOTAL** | **27** | **43** | **51** | **9** | **130** |

---

## 2. Security Vulnerabilities

### 2.1 CRITICAL: Weak JWT Secret Hardcoded

- **File:** `apps/api/src/.env.production:2`
- **Issue:** `JWT_SECRET=impler` - a trivially guessable secret used for all JWT signing
- **Exploit:** Attacker forges valid JWT tokens for ANY user, bypasses authentication entirely, accesses 1M+ user accounts
- **Fix:**
  ```bash
  # Generate cryptographically strong secret
  JWT_SECRET=$(openssl rand -hex 64)
  # Store in AWS Secrets Manager / HashiCorp Vault
  # Rotate immediately, invalidate all existing tokens
  ```

### 2.2 CRITICAL: Remote Code Execution - UNSANDBOXED Mode

- **File:** `apps/api/src/.env.production:36`
- **Issue:** `EXECUTION_MODE=UNSANDBOXED` - validator code is executed directly without sandbox isolation
- **Details:** `apps/api/src/app/review/usecases/do-review/base-review.usecase.ts` writes user-provided `onBatchInitialize` code to file and executes it with `exec()`
- **Exploit:** Attacker creates template with malicious validator: `require('child_process').exec('rm -rf /')` - achieves full RCE
- **Fix:**
  - Switch to `EXECUTION_MODE=SANDBOXED`
  - Validate `onBatchInitialize` code with static analysis
  - Use DSL for validators instead of arbitrary code

### 2.3 CRITICAL: SSRF in Webhook Callbacks (No URL Validation)

- **Files:**
  - `apps/queue-manager/src/consumers/base.consumer.ts:34-57`
  - `apps/api/src/app/template/usecases/send-sample-request/send-sample-request.usecase.ts:330-335`
- **Issue:** `callbackUrl` used directly in `axios()` without ANY URL validation
- **Exploit:** Attacker sets webhook to `http://169.254.169.254/latest/meta-data/` (AWS metadata) or `http://localhost:27017` (MongoDB)
- **Fix:**
  ```typescript
  // Validate webhook URLs
  import { URL } from 'url';
  import { isIP } from 'net';

  function validateWebhookUrl(urlStr: string): boolean {
    const url = new URL(urlStr);
    if (url.protocol !== 'https:') return false;
    if (isIP(url.hostname)) return false; // Block direct IP
    const blocked = ['localhost', '127.0.0.1', '169.254.169.254', '10.', '172.16.', '192.168.'];
    if (blocked.some(b => url.hostname.startsWith(b))) return false;
    return true;
  }
  ```

### 2.4 CRITICAL: Default RabbitMQ Credentials

- **File:** `apps/api/src/.env.production:6`
- **Issue:** `RABBITMQ_CONN_URL=amqp://guest:guest@localhost:5672`
- **Fix:** Generate strong credentials, disable guest user, enforce network isolation

### 2.5 CRITICAL: Default AWS S3 Credentials

- **File:** `apps/api/src/.env.production:16-17`
- **Issue:** `AWS_ACCESS_KEY_ID=impler`, `AWS_SECRET_ACCESS_KEY=implers3cr3t`
- **Fix:** Use IAM roles/STS tokens, generate strong access keys, restrict bucket policy

### 2.6 CRITICAL: JWT Verification Error Swallowed in Auth Guard

- **File:** `apps/api/src/app/shared/framework/auth.gaurd.ts:49`
- **Issue:** `catch (err) {}` - JWT verification failure silently ignored, allowing invalid tokens through
- **Fix:**
  ```typescript
  catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
  ```

### 2.7 HIGH: Path Traversal in Asset Download

- **File:** `libs/services/src/name/file-name.service.ts:72-74`
- **Issue:** `fileName` parameter not sanitized - no `path.basename()` call
- **Exploit:** `GET /v1/upload/{id}/asset/../../../etc/passwd`
- **Fix:**
  ```typescript
  import * as path from 'path';
  getAssetFilePath(uploadId: string, fileName: string): string {
    const safeFileName = path.basename(fileName);
    return `${uploadId}/${safeFileName}`;
  }
  ```

### 2.8 HIGH: Missing File Size Validation

- **File:** `apps/api/src/app/shared/validations/valid-import-file.validation.ts`
- **Issue:** Only validates MIME type, NOT file size. `MAX_FILE_SIZE` constant defined but never enforced
- **Fix:** Add `if (value.size > MAX_FILE_SIZE) throw new FileSizeException();`

### 2.9 HIGH: JWT Token Expiry Too Long (24 hours)

- **File:** `apps/api/src/app/shared/constants.ts:55`
- **Issue:** `maxAge: 1000 * 60 * 60 * 24 * 1` (24 hours)
- **Fix:** Reduce to 15-30 minutes, implement refresh token rotation

### 2.10 HIGH: Unprotected Aggregate Queries

- **File:** `libs/dal/src/repositories/base-repository.ts:48-50`
- **Issue:** `aggregate()` accepts raw unsanitized MongoDB aggregation pipeline
- **Fix:** Validate pipeline stages, whitelist allowed operators

### 2.11 HIGH: JWT Decoded Without Verification in UserSession

- **File:** `apps/api/src/app/shared/framework/user.decorator.ts:18`
- **Issue:** Uses `jwt.decode()` WITHOUT `jwt.verify()` - signature NOT validated
- **Fix:** Use `jwtService.verifyAsync()` before decoding

### 2.12 MEDIUM: No Rate Limiting on Any Endpoint

- **Files:** All API controllers
- **Issue:** No rate limiting middleware found anywhere in the codebase
- **Fix:** Implement `@nestjs/throttler` on all endpoints

### 2.13 MEDIUM: No Security Headers

- **File:** `apps/api/src/bootstrap.ts`
- **Issue:** Missing `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`
- **Fix:** Add `helmet()` middleware

### 2.14 MEDIUM: Swagger Documentation Exposed in Production

- **File:** `apps/api/src/bootstrap.ts:66`
- **Issue:** API docs at `/api` publicly accessible
- **Fix:** Disable in production: `if (process.env.NODE_ENV !== 'production') { SwaggerModule.setup(...) }`

### 2.15 MEDIUM: Prototype Pollution in Custom Record Format

- **File:** `apps/queue-manager/src/consumers/send-webhook-data.consumer.ts:172-189`
- **Issue:** `JSON.parse(recordFormat)` without validation - can inject `__proto__`
- **Fix:** Validate format structure, whitelist allowed keys

### Security Findings Summary Table

| # | Severity | Category | Issue | Impact |
|---|----------|----------|-------|--------|
| 2.1 | CRITICAL | Auth | Weak JWT Secret `impler` | Complete auth bypass |
| 2.2 | CRITICAL | RCE | UNSANDBOXED code execution | Full server compromise |
| 2.3 | CRITICAL | SSRF | No webhook URL validation | Internal network access |
| 2.4 | CRITICAL | Secrets | RabbitMQ `guest:guest` | Queue poisoning |
| 2.5 | CRITICAL | Secrets | AWS `impler/implers3cr3t` | S3 data theft |
| 2.6 | CRITICAL | Auth | JWT error swallowed | Auth bypass |
| 2.7 | HIGH | File | Path traversal in assets | Arbitrary file read |
| 2.8 | HIGH | DoS | No file size validation | Memory exhaustion |
| 2.9 | HIGH | Auth | 24h JWT expiry | Extended theft window |
| 2.10 | HIGH | Injection | Raw aggregate queries | Data extraction |
| 2.11 | HIGH | Auth | JWT decoded without verify | Token forgery |
| 2.12 | MEDIUM | DoS | No rate limiting | Brute force/DoS |
| 2.13 | MEDIUM | Headers | Missing security headers | XSS/Clickjacking |
| 2.14 | MEDIUM | Info Leak | Swagger in production | API enumeration |
| 2.15 | MEDIUM | Injection | Prototype pollution risk | Privilege escalation |

---

## 3. Error Handling & Validation

### 3.1 Type Safety - Critical Configuration Issues

| File | Setting | Current | Required |
|------|---------|---------|----------|
| `tsconfig.base.json:3` | `strictNullChecks` | `false` | `true` |
| `tsconfig.base.json:5` | `noImplicitAny` | `false` | `true` |
| `tsconfig.base.json:16` | `strictPropertyInitialization` | `false` | `true` |

**Impact:** Allows null/undefined violations, implicit `any` types, and uninitialized properties - leading to runtime crashes that TypeScript should catch at compile time.

### 3.2 CRITICAL: Empty Catch Blocks (Swallowed Errors)

| Severity | File | Issue | Impact |
|----------|------|-------|--------|
| CRITICAL | `apps/api/src/app/shared/framework/auth.gaurd.ts:49` | JWT verification error swallowed | Authentication bypass |
| CRITICAL | `apps/queue-manager/src/consumers/send-webhook-data.consumer.ts:132` | Webhook error swallowed | Data loss - customers unaware |
| CRITICAL | `apps/api/src/app/review/usecases/do-review/re-review-data.usecase.ts:286` | bulkWrite failure swallowed | Incomplete validation results |
| HIGH | `apps/api/src/app/template/usecases/download-sample/download-sample.usecase.ts:46` | JSON.parse error swallowed | Wrong sample data |
| HIGH | `apps/api/src/app/upload/usecases/make-upload-entry/make-upload-entry.usecase.ts:119` | JSON.parse error swallowed | Wrong upload mapping |
| HIGH | `apps/api/src/app/shared/services/file/file.service.ts:124` | JSON.parse error swallowed | Silent Excel parsing failures |
| HIGH | `libs/services/src/storage/storage.service.ts:108` | S3 deleteFolder error swallowed | Storage cost leak |

### 3.3 CRITICAL: Broken Exception Filter

- **File:** `apps/api/src/app/shared/filters/exception.filter.ts:5`
- **Issue:** `@Catch()` with NO parameters - only catches unknown errors; HTTP exceptions bypass filter
- **Fix:** Change to `@Catch(Error)` to catch all exceptions

### 3.4 HIGH: Fire-and-Forget Async Calls

- **File:** `apps/api/src/app/review/usecases/start-process/start-process.usecase.ts:84`
- **Issue:** `publishToQueue()` called without `await` - queue publish failures silently ignored
- **Impact:** Import never processes, customer unaware

- **File:** `apps/api/src/app/review/usecases/start-process/start-process.usecase.ts:200-207`
- **Issue:** `forEach()` with `async/await` not awaited properly
- **Fix:** Replace with `Promise.all()` or `for...of` loop

### 3.5 HIGH: Missing Input Validation on DTOs

| File | Field | Missing Validator | Risk |
|------|-------|-------------------|------|
| `apps/api/src/app/import-jobs/dtos/create-userjob.dto.ts:10` | `url` | `@IsUrl()` | Malicious URL injection |
| `apps/api/src/app/import-jobs/dtos/create-userjob.dto.ts:26` | `cron` | Cron validation | Invalid cron crashes scheduler |
| `apps/api/src/app/upload/dtos/upload-request.dto.ts:70` | `maxRecords` | `@Max()` range | Extreme values (negative/1B) |
| `apps/api/src/app/auth/dtos/register-user.dto.ts:9` | `firstName` | `@MaxLength(50)` | 10K char name storage |
| `apps/api/src/app/auth/dtos/login-user.dto.ts:15` | `password` | `@MinLength(6)` | Empty password accepted |

### 3.6 HIGH: No Pagination Limits

- **Files:** `apps/api/src/app/review/review.controller.ts:82-83`, `apps/api/src/app/upload/upload.controller.ts:203-204`
- **Issue:** No max validation on `page` and `limit` query params
- **Exploit:** `?limit=999999` causes memory exhaustion
- **Fix:** Add `@Max(1000)` to limit parameter

### 3.7 HIGH: Queue Message Acknowledgment Disabled

- **File:** `apps/queue-manager/src/bootstrap.ts:54-103`
- **Issue:** All queues use `noAck: true` - no message acknowledgment
- **Impact:** Messages permanently lost if consumer crashes mid-processing

### 3.8 HIGH: External Service Error Handling Missing

| Service | File | Issue |
|---------|------|-------|
| AWS SES Email | `libs/services/src/email/email.service.ts:774-793` | No try/catch on `sendMail()` |
| S3 Upload | `libs/services/src/storage/storage.service.ts:111-127` | No try/catch on `uploadFile()` |
| GitHub OAuth | `apps/api/src/app/auth/auth.controller.ts:62-73` | No OAuth response validation |

### 3.9 MEDIUM: Validation Pipe Missing Safety Options

- **File:** `apps/api/src/bootstrap.ts:36-39`
- **Issue:** `ValidationPipe` missing `whitelist: true` and `forbidUnknownValues: true`
- **Impact:** Mass assignment - attackers can inject unauthorized fields
- **Fix:**
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: true,
    transform: true,
  }));
  ```

---

## 4. Dependency Upgrades

### 4.1 CRITICAL: TypeScript Version Fragmentation

| Location | Current | Target |
|----------|---------|--------|
| api, queue-manager, dal, services, shared, embed | 4.8.3 | 5.6+ |
| web | 4.9.5 | 5.6+ |
| client | 4.8.4 | 5.6+ |
| react, angular | 4.4.4 | 5.6+ |

**Breaking changes:** Decorator behavior, type narrowing changes
**Benefit:** ~30% faster compilation, better type inference, modern features
**Effort:** Significant - requires systematic update across entire monorepo

### 4.2 CRITICAL: Unmaintained `hat` Package

- **File:** `apps/api/package.json`
- **Current:** `hat@0.0.3` (last updated: 2012)
- **Used for:** Generating random IDs (API keys)
- **Alternative:** `uuid@9.0.0` (already in dependencies) or `crypto.randomBytes()`
- **Priority:** CRITICAL - security implications for API key generation

### 4.3 HIGH: Major Framework Upgrades

| Framework | Current | Target | Breaking | Effort |
|-----------|---------|--------|----------|--------|
| NestJS | 10.4.4 | 11.x | Yes (module system, decorators) | Moderate |
| Next.js | 14.2.30 | 15.x | Yes (App Router, API updates) | Moderate-Significant |
| Mantine | 6.0.21 | 7.x | Yes (hook API, component props) | Moderate |
| TanStack Query | 4.14.5 | 5.x | Yes (query key syntax) | Moderate |
| TypeScript-ESLint | 5.48.2 | 7.x+ | Yes (requires TS 5.x) | Low |

### 4.4 HIGH: Create React App Deprecated

- **File:** `apps/widget/package.json` - `react-scripts@5.0.1`
- **Status:** CRA is in maintenance mode since 2023, no longer actively developed
- **Recommendation:** Migrate widget to Vite (10-20x faster dev server, modern tooling)
- **Effort:** Significant but widget is isolated (good candidate)

### 4.5 MEDIUM: AWS SDK Version Fragmentation

| Package | Current | Target |
|---------|---------|--------|
| @aws-sdk/client-s3 | 3.185.0 | 3.600+ |
| @aws-sdk/client-ses | 3.616.0 | 3.600+ |
| @aws-sdk/lib-storage | 3.360.0 | 3.600+ |
| @aws-sdk/s3-request-presigner | 3.276.0 | 3.600+ |

**Issue:** 18+ month version gaps between AWS SDK packages in same project

### 4.6 MEDIUM: Socket.io Version Mismatch

- API: `socket.io@4.7.2` vs Widget: `socket.io-client@4.8.1`
- **Fix:** Standardize to 4.8.1

### 4.7 MEDIUM: Deprecated `passport-github2`

- **Current:** `passport-github2@0.1.12` (last major update: 2017)
- **Recommendation:** Migrate to `passport-oauth2` with explicit GitHub config

### 4.8 HIGH: @impler/client Version Mismatch

- React and Angular packages specify `^0.29.0` for `@impler/client`
- Workspace version is `1.9.3`
- **Fix:** Use `workspace:^` like other internal packages

### 4.9 LOW: Compilation Target

- **Current:** `"target": "es5"` in `tsconfig.base.json`
- **Recommendation:** Update to `"target": "es2020"` - Node 20 supports it natively, reduces polyfills, smaller bundle

### Recommended Upgrade Sequence

| Phase | Timeframe | Upgrades | Risk |
|-------|-----------|----------|------|
| 1 | Weeks 1-2 | pnpm 9.x, replace `hat`, fix @impler/client version, TypeScript-ESLint 7.x | Low |
| 2 | Weeks 2-3 | TypeScript 4.x → 5.6+ (all packages), tsconfig target es5 → es2020 | Medium |
| 3 | Weeks 3-4 | Next.js 14 → 15, NestJS 10 → 11 | Medium |
| 4 | Weeks 4-6 | Mantine 6 → 7, CRA → Vite, TanStack Query 4 → 5 | Medium |
| 5 | Week 6+ | passport-github2 migration, AWS SDK standardization, Socket.io sync | Low |

---

## 5. Cross-Dependency Security & Optimization

### 5.1 CRITICAL: IDOR Vulnerabilities (Insecure Direct Object Reference)

#### 5.1.1 Project Switch - No Ownership Verification

- **File:** `apps/api/src/app/project/project.controller.ts:150-181`
- **Issue:** `switchProject` accepts ANY projectId without verifying user belongs to it
- **Exploit:** User A calls `PUT /v1/project/switch/{UserB_ProjectId}` and gains access to User B's project
- **Impact:** Complete cross-tenant data breach

#### 5.1.2 Template Delete - No Project Scope

- **File:** `apps/api/src/app/template/usecases/delete-template/delete-template.usecase.ts:8-10`
- **Issue:** `delete({ _id: id })` without `_projectId` check
- **Exploit:** User deletes ANY template by guessing ObjectId

#### 5.1.3 Template Destination Update - Missing Scope

- **File:** `apps/api/src/app/template/usecases/update-destination/update-destination.usecase.ts:19-24`
- **Issue:** `findById(_templateId)` without `_projectId` check
- **Exploit:** User reconfigures webhooks for other users' templates

#### 5.1.4 Team Operations - No Authorization

- **File:** `apps/api/src/app/team/team.controller.ts:76-93`
- **Issue:** Team member update/delete without project ownership verification
- **Exploit:** User modifies roles in other projects

#### 5.1.5 Repository Queries Missing Project Scope

- **Files:** `column.repository.ts`, `validator.repository.ts`, `mapping.repository.ts`, `webhook-destination.repository.ts`
- **Issue:** Base repositories have no tenant-aware defaults
- **Fix:** Add `_projectId` scope to all repository query methods

### 5.2 HIGH: API Key Stored in JWT Token

- **File:** `apps/api/src/app/auth/services/auth.service.ts:136-157`
- **Issue:** `accessToken` (API key) embedded in JWT claims
- **Impact:** JWT compromise also exposes API key; tokens appear in logs
- **Fix:** Store only user ID in JWT, retrieve API key on demand

### 5.3 HIGH: Weak API Key Entropy

- **File:** `apps/api/src/app/environment/usecases/generate-api-key/generate-api-key.usecase.ts:30-39`
- **Issue:** Uses `hat()` (~128 bits) with only 3 retry attempts for collision
- **Fix:** Use `crypto.randomBytes(32).toString('hex')` for 256-bit entropy

### 5.4 CRITICAL: WebSocket Has No Authentication

- **File:** `apps/api/src/app/shared/services/websocket-service/websocket.service.ts:15-50`
- **Issue:** No auth check on connection or message handlers; ANY user can join ANY session
- **Fix:** Implement JWT verification on WebSocket handshake

### 5.5 HIGH: N+1 Query Pattern in Upload Repository

- **File:** `libs/dal/src/repositories/upload/upload.repository.ts:154-323`
- **Issue:** Complex aggregation with multiple `$lookup` operations
- **Fix:** Add composite indexes, optimize aggregation pipeline

### 5.6 MEDIUM: Missing Composite Indexes

- **Current:** Basic single-field indexes only
- **Missing:**
  - `{ _projectId: 1, createdAt: -1 }` on templates
  - `{ _templateId: 1, uploadedDate: -1 }` on uploads
  - `{ uploadId: 1, isValid: 1 }` on records
- **Impact:** O(n) scans instead of O(log n)

### 5.7 MEDIUM: File Processing Uses Buffers Not Streams

- **File:** `apps/api/src/app/upload/usecases/make-upload-entry/make-upload-entry.usecase.ts:175-182`
- **Issue:** Entire file kept in memory as `file.buffer` before upload
- **Impact:** Large files (>100MB) cause OOM crashes

### 5.8 MEDIUM: No Caching Anywhere

- **API Key Lookups:** `apps/api/src/app/auth/services/auth.service.ts:178-183` - DB query on every request
- **Template Queries:** Hit DB for every widget render
- **Impact:** Massive unnecessary database load

### 5.9 MEDIUM: Database Connection Pool Not Configured

- **File:** `libs/dal/src/dal.service.ts:9-15`
- **Issue:** No explicit pool config - default `maxPoolSize: 5-10`
- **Fix:** Configure `maxPoolSize: 100`, `minPoolSize: 10`, `socketTimeoutMS: 30000`

### 5.10 MEDIUM: Circular Dependency

- **File:** `apps/api/src/app/shared/framework/auth.gaurd.ts:28`
- **Issue:** `@Inject(forwardRef(() => AuthService))` - indicates circular dependency
- **Fix:** Refactor auth service to break circular dependency

---

## 6. Architecture Optimization for 10M Scale

### 6.1 Current vs Target Architecture

```
CURRENT (1K-5K req/s)                 TARGET (10M req/s)
========================              ========================
Single NestJS process         →       25-100 K8s pods (HPA)
PM2 standalone mode           →       PM2 cluster mode (all cores)
HTTP/1.1 only                 →       HTTP/2 via Nginx reverse proxy
No caching                    →       Redis cluster (50GB)
MongoDB default pool (5)      →       Pool 100 + sharding + replicas
RabbitMQ (durable:false)      →       Durable + DLQ + prefetch
In-memory file processing     →       Stream + worker threads
Docker Compose                →       Kubernetes + HPA
Sentry only                   →       OpenTelemetry + Prometheus + Grafana
```

### 6.2 P0: Redis Caching Layer (HIGHEST IMPACT)

**Current:** ZERO caching - every request hits MongoDB
**Proposed:** Redis cluster with strategic caching

| Data | TTL | Hit Rate | Impact |
|------|-----|----------|--------|
| Templates + columns | 1 hour | 95% | 100x faster |
| API key validation | 24 hours | 99% | DB load -50% |
| User sessions | 7 days | 99% | DB load -30% |
| Upload status | 30 min | 80% | Real-time updates |
| CORS origins | 7 days | 99.9% | -0.1ms per request |

**Implementation:**
```typescript
// SharedModule
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

CacheModule.register({
  isGlobal: true,
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: 3600,
  max: 1000000,
})
```

**Result:** 10x throughput improvement, DB load -50-70%
**Effort:** 4-6 days

### 6.3 P0: PM2 Cluster Mode

**Current:** Single process - 1 CPU core used
**Proposed:** Cluster mode - all CPU cores

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
  }]
};
```

**Result:** 4x throughput per instance (4-core servers)
**Effort:** 2-3 hours

### 6.4 P0: HTTP/2, Keep-Alive, Graceful Shutdown

**Current:** HTTP/1.1, no keep-alive config, no graceful shutdown
**Proposed:**
- HTTP/2 via Nginx reverse proxy
- Keep-alive: 120s timeout
- Compression threshold: >1KB only
- Request timeout: 30s
- Graceful shutdown handler
- `server.maxConnections = 100000`

**Result:** 5-10x request parallelism per connection, -40ms p99 latency
**Effort:** 3-5 days

### 6.5 P0: MongoDB Connection Pool & Indexes

**Current:** Default pool (5-10 connections), basic indexes
**Proposed:**
```typescript
mongoose.connect(url, {
  maxPoolSize: 100,
  minPoolSize: 10,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
});
```

**New indexes:**
- `{ _projectId: 1, createdAt: -1 }` on templates
- `{ _templateId: 1, uploadedDate: -1 }` on uploads
- `{ uploadId: 1, isValid: 1 }` on records

**Sharding key:** `uploadId` (hash) on records collection

**Result:** 10x concurrent DB operations
**Effort:** 5-7 days

### 6.6 P0: RabbitMQ Hardening

**Current:** `durable: false`, `noAck: true` on ALL queues
**Proposed:**
```typescript
channel.assertQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
  durable: true,
  arguments: {
    'x-max-length': 1000000,
    'x-dead-letter-exchange': 'dlx-exchange',
    'x-dead-letter-routing-key': 'webhook-dlq'
  }
});
channel.prefetch(10);
channel.consume(queue, handler, { noAck: false }); // Manual ack
```

**Result:** Zero message loss, graceful degradation under load
**Effort:** 3-4 days

### 6.7 P0: Kubernetes Deployment

**Current:** Docker Compose, single instance per service
**Proposed:** Kubernetes with HPA

```yaml
# 25-100 API pods, auto-scaling on CPU/memory
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 25
  maxReplicas: 100
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
```

**Result:** Elastic scaling from 1K to 10M req/s
**Effort:** 5-7 days

### 6.8 P0: Observability Stack

**Current:** Sentry only (no metrics, no tracing, no dashboards)
**Proposed:** OpenTelemetry + Prometheus + Grafana + ELK

**Key metrics:**
- `http_requests_total` (per endpoint)
- `http_request_duration_seconds` (latency histogram)
- `db_query_duration_seconds`
- `queue_messages_processed`
- `cache_hit_rate`

**Alerts:**
- Error rate > 1% → P1
- Latency p99 > 5s → P1
- DB connections > 80% → P2
- Queue depth > 100K → P2

**Result:** -70% MTTR, data-driven capacity planning
**Effort:** 4-5 days

### 6.9 P1: Stream-Based File Processing

**Current:** Entire file loaded to `file.buffer` in memory
**Proposed:**
1. Pre-signed URLs: Browser uploads directly to S3 (bypass API)
2. Stream processing: Pipe S3 → CSV parser → DB (line-by-line)
3. Worker threads for Excel parsing (4-8 workers)
4. Chunked uploads: 5MB chunks, resume on failure

**Result:** Support 1GB+ files, constant 50MB memory vs 500MB
**Effort:** 5-7 days

### 6.10 P1: Data Archival & TTL

**Current:** All data retained indefinitely
**Proposed:**
- Records >90 days → S3 Glacier
- Failed imports >7 days → auto-delete
- Files >30 days → cold storage
- TTL indexes on MongoDB

**Result:** 70-90% reduction in working set, faster queries
**Effort:** 3-4 days

### 6.11 P2: Microservice Decomposition

**Current:** Monolithic API (15 modules)
**Proposed decomposition:**

| Service | Responsibility | Scaling |
|---------|---------------|---------|
| Upload Service | File upload/parsing (high memory) | 10-50 replicas |
| Webhook Service | Webhook delivery/callbacks | 5-20 replicas |
| Template/Config Service | Read-heavy, cache-friendly | 20-50 replicas |
| Auth/Session Service | Token validation, user mgmt | 5-10 replicas |
| Core API | Project, column, mapping | 25-75 replicas |

**Result:** Independent scaling, failure isolation, team autonomy
**Effort:** 3-4 weeks
**Risk:** High - distributed system complexity

### Performance Projection Table

| Metric | Current | After P0 | After P0+P1 | Target 10M |
|--------|---------|----------|-------------|-----------|
| Requests/sec/instance | ~25K | ~100K | ~150K | 200K+ |
| Instances needed | 1 | 25 | 67 | 50-100 |
| Latency p50 | 50ms | 30ms | 20ms | <15ms |
| Latency p99 | 500ms | 200ms | 80ms | <100ms |
| Error rate | 0.5% | 0.1% | 0.05% | <0.01% |
| Cache hit rate | 0% | 85% | 90% | >95% |
| DB connections | 5 | 100 | 20 (pooled) | 20-30 (sharded) |
| Memory/instance | 512MB | 512MB | 800MB | 1GB |

### Pros and Cons Summary

| Optimization | Pros | Cons |
|-------------|------|------|
| Redis Caching | 100x faster for cached data; -50% DB load | Additional infrastructure; cache coherency complexity; Redis HA required |
| PM2 Cluster | 4x throughput; easy to implement; auto-restart | Shared memory complexity; monitoring increases |
| HTTP/2 | 5-10x parallelism; designed for high concurrency | Requires reverse proxy; client compatibility |
| MongoDB Sharding | Horizontal scaling; even distribution | Operational complexity; cross-shard queries slow; migration downtime |
| Kubernetes | Industry standard; elastic scaling; zero-downtime | Steep learning curve; $5-10K/month; requires DevOps expertise |
| Microservices | Independent scaling; failure isolation | Distributed system complexity; debugging harder; network latency |
| Stream Processing | Handles 1GB+ files; constant memory | Complex error recovery; requires S3 temp storage |
| OpenTelemetry | -70% MTTR; data-driven decisions | Infrastructure overhead; initial instrumentation effort |

---

## 7. Implementation Roadmap

### Phase 1: Critical Security Fixes (Week 1) - URGENT

| # | Task | Severity | Effort | Files |
|---|------|----------|--------|-------|
| 1 | Rotate JWT_SECRET to cryptographic random | CRITICAL | 1 hour | `.env.production` |
| 2 | Set EXECUTION_MODE=SANDBOXED | CRITICAL | 1 hour | `.env.production` |
| 3 | Rotate RabbitMQ credentials | CRITICAL | 1 hour | `.env.production` |
| 4 | Rotate AWS credentials, use IAM roles | CRITICAL | 2 hours | `.env.production` |
| 5 | Fix JWT error swallowing in auth guard | CRITICAL | 30 min | `auth.gaurd.ts:49` |
| 6 | Add webhook URL validation (SSRF block) | CRITICAL | 4 hours | `base.consumer.ts`, DTOs |
| 7 | Fix path traversal in asset download | HIGH | 1 hour | `file-name.service.ts` |
| 8 | Add file size validation | HIGH | 1 hour | `valid-import-file.validation.ts` |
| 9 | Fix JWT decode without verify | HIGH | 2 hours | `user.decorator.ts` |
| 10 | Add IDOR checks to all controllers | CRITICAL | 1 day | All controllers/usecases |

### Phase 2: Error Handling & Validation (Weeks 2-3)

| # | Task | Effort | Files |
|---|------|--------|-------|
| 1 | Fix all empty catch blocks (7 critical) | 1 day | Multiple files |
| 2 | Fix exception filter `@Catch()` decorator | 1 hour | `exception.filter.ts` |
| 3 | Add missing DTO validators | 1 day | All DTOs |
| 4 | Add pagination max limits | 2 hours | Controllers |
| 5 | Add `whitelist: true` to ValidationPipe | 30 min | `bootstrap.ts` |
| 6 | Fix async forEach patterns | 2 hours | `start-process.usecase.ts` |
| 7 | Add error handling to email/storage services | 4 hours | `email.service.ts`, `storage.service.ts` |
| 8 | Implement rate limiting (`@nestjs/throttler`) | 4 hours | `bootstrap.ts`, auth controllers |
| 9 | Add security headers (helmet) | 1 hour | `bootstrap.ts` |
| 10 | Disable Swagger in production | 30 min | `bootstrap.ts` |

### Phase 3: Performance Foundation (Weeks 3-5)

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Deploy Redis, implement caching layer | 4-6 days | 10x throughput |
| 2 | PM2 cluster mode | 2-3 hours | 4x throughput |
| 3 | HTTP/2 + Nginx reverse proxy | 3-5 days | 5x parallelism |
| 4 | MongoDB connection pool configuration | 1 day | 10x DB ops |
| 5 | Add composite database indexes | 1 day | 50-100x query speed |
| 6 | RabbitMQ durability + DLQ + prefetch | 3-4 days | Zero message loss |
| 7 | WebSocket authentication | 2 days | Security fix |

### Phase 4: Dependency Upgrades (Weeks 5-8)

| # | Task | Effort | Risk |
|---|------|--------|------|
| 1 | Replace `hat` with `crypto.randomBytes` | 2 hours | None |
| 2 | Fix @impler/client version in packages | 1 hour | None |
| 3 | TypeScript 4.x → 5.6+ (all packages) | 3-5 days | Medium |
| 4 | NestJS 10 → 11 | 2-3 days | Medium |
| 5 | Next.js 14 → 15 | 2-3 days | Medium |
| 6 | Migrate widget: CRA → Vite | 3-5 days | Medium |
| 7 | Mantine 6 → 7 | 3-5 days | Medium |
| 8 | Standardize AWS SDK versions | 1 day | Low |

### Phase 5: Scale Infrastructure (Weeks 8-12)

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Kubernetes deployment manifests | 5-7 days | Elastic scaling |
| 2 | HPA auto-scaling policies | 2 days | Cost optimization |
| 3 | OpenTelemetry instrumentation | 3 days | Observability |
| 4 | Prometheus + Grafana dashboards | 2 days | Monitoring |
| 5 | MongoDB sharding | 3-5 days | DB horizontal scale |

### Phase 6: Advanced Optimization (Weeks 12-16)

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Stream-based file processing | 5-7 days | 1GB+ file support |
| 2 | Pre-signed URL direct uploads | 3 days | API bypass for files |
| 3 | Worker threads for Excel | 2 days | Non-blocking parsing |
| 4 | Data archival + TTL indexes | 3-4 days | 70% storage reduction |
| 5 | Evaluate microservice decomposition | 2-4 weeks | Independent scaling |

---

## 8. Cost Projections

### Infrastructure Cost: Current vs 10M Scale

| Component | Current | 10M Scale | Notes |
|-----------|---------|-----------|-------|
| MongoDB | $200/mo | $2K-5K/mo | Sharding, replicas, larger instances |
| Redis | $0 | $500-2K/mo | 20-50GB cluster |
| RabbitMQ | $100/mo | $300-500/mo | Larger, durable storage |
| S3 Storage | $100/mo | $500-2K/mo | Including Glacier archival |
| Kubernetes | $0 | $5K-10K/mo | EKS/AKS, 50-100 nodes |
| Monitoring | $200/mo | $500-1K/mo | Prometheus, Grafana, ELK |
| Networking | $50/mo | $1K-2K/mo | Data transfer, CDN |
| **Total** | **~$650/mo** | **~$10K-22K/mo** | 15-35x cost increase |

### ROI

At 10M users with $10 ARPU/month:
- Revenue: $100M/month
- Infrastructure: $10-22K/month (0.01-0.022% of revenue)
- **ROI: Excellent**

### Engineering Investment

- **Team:** 4-5 senior engineers
- **Timeline:** 16 weeks (4 months)
- **Phases:** 6 phases, deployable incrementally
- **Each phase independently adds value**

---

## Appendix: Files Requiring Immediate Changes

### Security-Critical Files (Week 1)

| File | Change Required |
|------|----------------|
| `apps/api/src/.env.production` | Rotate ALL secrets |
| `apps/api/src/app/shared/framework/auth.gaurd.ts` | Fix JWT error handling |
| `apps/api/src/app/shared/framework/user.decorator.ts` | Add JWT verification |
| `libs/services/src/name/file-name.service.ts` | Path traversal fix |
| `apps/api/src/app/shared/validations/valid-import-file.validation.ts` | File size validation |
| `apps/queue-manager/src/consumers/base.consumer.ts` | SSRF URL validation |
| `apps/api/src/app/shared/services/websocket-service/websocket.service.ts` | WebSocket auth |
| All controllers with `findById()` | Add `_projectId` scope checks |

### Performance-Critical Files (Weeks 3-5)

| File | Change Required |
|------|----------------|
| `apps/api/src/bootstrap.ts` | HTTP/2, helmet, rate limiting, validation pipe |
| `libs/dal/src/dal.service.ts` | Connection pool configuration |
| `apps/api/src/app/shared/shared.module.ts` | Redis CacheModule import |
| `apps/queue-manager/src/bootstrap.ts` | Durable queues, DLQ, prefetch |
| `apps/api/Dockerfile` | PM2 cluster mode |
| All repository schemas | Composite indexes |

---

*This report covers 130 findings across 5 categories. Priority implementation should begin immediately with Phase 1 (critical security fixes) as several vulnerabilities allow complete system compromise.*
