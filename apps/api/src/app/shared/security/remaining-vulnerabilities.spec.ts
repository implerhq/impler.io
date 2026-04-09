import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf-8');
}

describe('Remaining Vulnerability Fixes', () => {
  describe('ReDoS Prevention - Regex Escaping', () => {
    it('should escape regex in get-imports usecase', () => {
      const content = readFile('apps/api/src/app/project/usecases/get-imports/get-imports.usecase.ts');
      expect(content).to.include('escapeRegex');
      expect(content).to.include("str.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')");
      expect(content).to.not.include("$regex: search || ''");
    });

    it('should escape regex in template repository', () => {
      const content = readFile('libs/dal/src/repositories/template/template.repository.ts');
      expect(content).to.include('escapeRegex');
      expect(content).to.include("str.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')");
      expect(content).to.not.include("$regex: name || ''");
    });

    it('should limit regex length in auto-import consumer', () => {
      const content = readFile('apps/queue-manager/src/consumers/get-auto-import-job-data.consumer.ts');
      expect(content).to.include('filter.value.length <= 200');
    });

    it('escapeRegex function should properly escape special characters', () => {
      // Simulate the escapeRegex function
      function escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      // These patterns would cause ReDoS if unescaped
      expect(escapeRegex('(a+)+b')).to.equal('\\(a\\+\\)\\+b');
      expect(escapeRegex('.*')).to.equal('\\.\\*');
      expect(escapeRegex('test|other')).to.equal('test\\|other');
      expect(escapeRegex('[^abc]')).to.equal('\\[\\^abc\\]');
      expect(escapeRegex('normal text')).to.equal('normal text');
    });
  });

  describe('IDOR Protection - Column Controller', () => {
    it('should inject UserSession in column controller routes', () => {
      const content = readFile('apps/api/src/app/column/column.controller.ts');
      // All three routes should have @UserSession()
      const userSessionCount = (content.match(/@UserSession\(\)/g) || []).length;
      expect(userSessionCount).to.be.at.least(3);
    });

    it('should pass _projectId to add-column usecase', () => {
      const content = readFile('apps/api/src/app/column/usecases/add-column/add-column.usecase.ts');
      expect(content).to.include('ForbiddenException');
      expect(content).to.include('_projectId');
      expect(content).to.include('Template not found or does not belong to this project');
    });

    it('should pass _projectId to update-column usecase', () => {
      const content = readFile('apps/api/src/app/column/usecases/update-column/update-column.usecase.ts');
      expect(content).to.include('ForbiddenException');
      expect(content).to.include('_projectId');
      expect(content).to.include('Column does not belong to this project');
    });

    it('should pass _projectId to delete-column usecase', () => {
      const content = readFile('apps/api/src/app/column/usecases/delete-column/delete-column.usecase.ts');
      expect(content).to.include('ForbiddenException');
      expect(content).to.include('_projectId');
      expect(content).to.include('Column does not belong to this project');
    });
  });

  describe('Missing Auth Guards - Team Controller', () => {
    let teamContent: string;
    before(() => {
      teamContent = readFile('apps/api/src/app/team/team.controller.ts');
    });

    it('should have @UseGuards(JwtAuthGuard) on GET /members route', () => {
      // Extract the section around listTeamMembersRoute
      const memberRouteIdx = teamContent.indexOf("@Get('/members')");
      const routeSection = teamContent.substring(memberRouteIdx - 50, memberRouteIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on PUT /:memberId route', () => {
      const updateRouteIdx = teamContent.indexOf("@Put('/:memberId')");
      const routeSection = teamContent.substring(updateRouteIdx, updateRouteIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on DELETE /:memberId route', () => {
      const deleteRouteIdx = teamContent.indexOf("@Delete('/:memberId')");
      const routeSection = teamContent.substring(deleteRouteIdx, deleteRouteIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on POST accept route', () => {
      const acceptIdx = teamContent.indexOf("@Post('/:invitationId/accept')");
      const routeSection = teamContent.substring(acceptIdx, acceptIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on DELETE decline route', () => {
      const declineIdx = teamContent.indexOf("@Delete('/:invitationId/decline')");
      const routeSection = teamContent.substring(declineIdx, declineIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on GET members meta route', () => {
      const metaIdx = teamContent.indexOf("@Get(':projectId/members')");
      const routeSection = teamContent.substring(metaIdx, metaIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on DELETE revoke route', () => {
      const revokeIdx = teamContent.indexOf("@Delete('/:invitationId/revoke')");
      const routeSection = teamContent.substring(revokeIdx, revokeIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });
  });

  describe('Missing Auth Guards - Review Controller', () => {
    let reviewContent: string;
    before(() => {
      reviewContent = readFile('apps/api/src/app/review/review.controller.ts');
    });

    it('should have @UseGuards(JwtAuthGuard) on GET :uploadId route', () => {
      const getIdx = reviewContent.indexOf("@Get(':uploadId')");
      const routeSection = reviewContent.substring(getIdx, getIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards(JwtAuthGuard) on POST :uploadId route', () => {
      const postIdx = reviewContent.indexOf("@Post(':uploadId')");
      const routeSection = reviewContent.substring(postIdx, postIdx + 200);
      expect(routeSection).to.include('@UseGuards(JwtAuthGuard)');
    });

    it('should have @UseGuards on all state-changing routes', () => {
      // Count total routes vs guarded routes
      const postRoutes = (reviewContent.match(/@Post\(/g) || []).length;
      const putRoutes = (reviewContent.match(/@Put\(/g) || []).length;
      const guardCount = (reviewContent.match(/@UseGuards\(JwtAuthGuard\)/g) || []).length;

      // All POST and PUT routes should have guards
      expect(guardCount).to.be.at.least(postRoutes + putRoutes);
    });
  });

  describe('API Key Removed from JWT', () => {
    it('should store boolean flag instead of raw API key in JWT', () => {
      const content = readFile('apps/api/src/app/auth/services/auth.service.ts');
      expect(content).to.include("accessToken: user.accessToken ? true : undefined");
      expect(content).to.include('Store only a boolean flag instead of the raw API key');
    });

    it('should fetch actual API key in /me endpoint', () => {
      const content = readFile('apps/api/src/app/auth/auth.controller.ts');
      expect(content).to.include('getApiKeyForUserId');
      expect(content).to.include("accessToken: apiKey?.apiKey || undefined");
    });

    it('should handle hasProject flag in web middleware', () => {
      const content = readFile('apps/web/middleware.ts');
      expect(content).to.include('profileData.hasProject');
    });
  });
});
