import { expect } from 'chai';

describe('Aggregate Query Validation Tests', () => {
  const BLOCKED_STAGES = ['$out', '$merge'];

  function validateAggregatePipeline(query: any[]): string | null {
    if (!Array.isArray(query)) {
      return 'Aggregate pipeline must be an array';
    }
    for (const stage of query) {
      const stageKeys = Object.keys(stage);
      for (const key of stageKeys) {
        if (BLOCKED_STAGES.includes(key)) {
          return `Aggregate stage '${key}' is not allowed`;
        }
      }
    }

    return null;
  }

  describe('Pipeline validation', () => {
    it('should allow $match stage', () => {
      const error = validateAggregatePipeline([{ $match: { status: 'active' } }]);
      expect(error).to.be.null;
    });

    it('should allow $group stage', () => {
      const error = validateAggregatePipeline([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
      expect(error).to.be.null;
    });

    it('should allow $lookup stage', () => {
      const error = validateAggregatePipeline([
        { $lookup: { from: 'users', localField: '_userId', foreignField: '_id', as: 'user' } },
      ]);
      expect(error).to.be.null;
    });

    it('should allow $project stage', () => {
      const error = validateAggregatePipeline([{ $project: { name: 1, email: 1 } }]);
      expect(error).to.be.null;
    });

    it('should block $out stage (data exfiltration)', () => {
      const error = validateAggregatePipeline([{ $match: {} }, { $out: 'exfiltrated_collection' }]);
      expect(error).to.include('$out');
      expect(error).to.include('not allowed');
    });

    it('should block $merge stage (data exfiltration)', () => {
      const error = validateAggregatePipeline([{ $match: {} }, { $merge: { into: 'target_collection' } }]);
      expect(error).to.include('$merge');
      expect(error).to.include('not allowed');
    });

    it('should reject non-array pipeline', () => {
      const error = validateAggregatePipeline({} as any);
      expect(error).to.equal('Aggregate pipeline must be an array');
    });

    it('should allow complex multi-stage pipelines', () => {
      const error = validateAggregatePipeline([
        { $match: { status: 'active' } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $skip: 5 },
      ]);
      expect(error).to.be.null;
    });
  });
});
