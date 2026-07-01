import { expect } from 'chai';

describe('Prototype Pollution Protection Tests', () => {
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

  function safeJsonParse(jsonStr: string): any {
    return JSON.parse(jsonStr, (key, value) => {
      if (DANGEROUS_KEYS.includes(key)) return undefined;

      return value;
    });
  }

  describe('safeJsonParse', () => {
    it('should parse normal JSON correctly', () => {
      const result = safeJsonParse('{"name": "test", "value": 123}');
      expect(result.name).to.equal('test');
      expect(result.value).to.equal(123);
    });

    it('should strip __proto__ key', () => {
      const result = safeJsonParse('{"__proto__": {"isAdmin": true}, "name": "test"}');
      expect(result.__proto__).to.not.have.property('isAdmin');
      expect(result.name).to.equal('test');
    });

    it('should strip injected constructor payload', () => {
      const result = safeJsonParse('{"constructor": {"prototype": {"isAdmin": true}}, "name": "test"}');
      expect(result.name).to.equal('test');
      // The injected constructor value should not contain our malicious payload
      const hasInjectedValue =
        typeof result.constructor === 'object' &&
        result.constructor !== null &&
        result.constructor.prototype &&
        result.constructor.prototype.isAdmin === true;
      expect(hasInjectedValue).to.equal(false);
    });

    it('should strip injected prototype payload', () => {
      const result = safeJsonParse('{"prototype": {"isAdmin": true}, "name": "test"}');
      expect(result.name).to.equal('test');
      // Verify the injected prototype payload was removed
      const hasInjectedValue =
        typeof result.prototype === 'object' &&
        result.prototype !== null &&
        result.prototype.isAdmin === true;
      expect(hasInjectedValue).to.equal(false);
    });

    it('should prevent prototype chain pollution via nested __proto__', () => {
      const result = safeJsonParse('{"data": {"__proto__": {"isAdmin": true}, "value": 1}}');
      expect(result.data.value).to.equal(1);
      // The key test: isAdmin should NOT be accessible on the object
      expect(result.data.isAdmin).to.be.undefined;
    });

    it('should handle arrays correctly', () => {
      const result = safeJsonParse('[{"name": "a"}, {"name": "b"}]');
      expect(result).to.have.length(2);
      expect(result[0].name).to.equal('a');
    });

    it('should not pollute Object.prototype', () => {
      const before = ({} as any).isAdmin;
      safeJsonParse('{"__proto__": {"isAdmin": true}}');
      const after = ({} as any).isAdmin;
      expect(before).to.equal(after);
    });
  });
});
