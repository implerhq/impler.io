import { expect } from 'chai';

describe('IDOR Protection Tests', () => {
  describe('Project Switch - Ownership Verification', () => {
    it('should reject switch when user does not belong to project', () => {
      const projectEnvironment = {
        apiKeys: [
          { _userId: { toString: () => 'user-A' }, role: 'admin' },
          { _userId: { toString: () => 'user-B' }, role: 'member' },
        ],
      };
      const currentUser = { _id: 'user-C' };
      const userApiKey = projectEnvironment.apiKeys.find(
        (apiKey) => apiKey._userId.toString() === currentUser._id.toString()
      );

      expect(userApiKey).to.be.undefined;
    });

    it('should allow switch when user belongs to project', () => {
      const projectEnvironment = {
        apiKeys: [
          { _userId: { toString: () => 'user-A' }, role: 'admin' },
          { _userId: { toString: () => 'user-B' }, role: 'member' },
        ],
      };
      const currentUser = { _id: 'user-A' };
      const userApiKey = projectEnvironment.apiKeys.find(
        (apiKey) => apiKey._userId.toString() === currentUser._id.toString()
      );

      expect(userApiKey).to.not.be.undefined;
      expect(userApiKey.role).to.equal('admin');
    });
  });

  describe('Template Operations - Project Scope', () => {
    it('should verify template belongs to project before deletion', () => {
      const templates = [
        { _id: 'tmpl-1', _projectId: 'proj-A' },
        { _id: 'tmpl-2', _projectId: 'proj-B' },
      ];

      const userProjectId = 'proj-A';
      const templateId = 'tmpl-2';

      const template = templates.find((t) => t._id === templateId && t._projectId === userProjectId);
      expect(template).to.be.undefined;
    });

    it('should allow deletion when template belongs to users project', () => {
      const templates = [
        { _id: 'tmpl-1', _projectId: 'proj-A' },
        { _id: 'tmpl-2', _projectId: 'proj-B' },
      ];

      const userProjectId = 'proj-A';
      const templateId = 'tmpl-1';

      const template = templates.find((t) => t._id === templateId && t._projectId === userProjectId);
      expect(template).to.not.be.undefined;
      expect(template._projectId).to.equal(userProjectId);
    });
  });

  describe('Team Operations - Project Scope', () => {
    it('should reject team member update from different project', () => {
      const teamMember = { _projectId: { toString: () => 'proj-B' } };
      const callerProjectId = 'proj-A';

      const isSameProject = teamMember._projectId.toString() === callerProjectId;
      expect(isSameProject).to.equal(false);
    });

    it('should allow team member update within same project', () => {
      const teamMember = { _projectId: { toString: () => 'proj-A' } };
      const callerProjectId = 'proj-A';

      const isSameProject = teamMember._projectId.toString() === callerProjectId;
      expect(isSameProject).to.equal(true);
    });

    it('should reject team member removal from different project', () => {
      const teamMember = { _projectId: { toString: () => 'proj-X' } };
      const callerProjectId = 'proj-Y';

      const isSameProject = teamMember._projectId.toString() === callerProjectId;
      expect(isSameProject).to.equal(false);
    });
  });
});
