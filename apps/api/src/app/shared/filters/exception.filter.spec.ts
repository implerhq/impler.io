import { expect } from 'chai';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SentryFilter - Exception Handling', () => {
  describe('@Catch decorator behavior', () => {
    it('should distinguish HTTP exceptions from unknown errors', () => {
      const httpError = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      const unknownError = new Error('Database connection failed');

      expect(httpError instanceof HttpException).to.equal(true);
      expect(unknownError instanceof HttpException).to.equal(false);
    });

    it('should correctly identify HttpException subclasses', () => {
      const badRequest = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      const unauthorized = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      expect(badRequest instanceof HttpException).to.equal(true);
      expect(unauthorized instanceof HttpException).to.equal(true);
    });

    it('should handle TypeError/ReferenceError as unknown errors', () => {
      const typeError = new TypeError('Cannot read property of null');
      const refError = new ReferenceError('x is not defined');

      // These should NOT be HttpExceptions - they should go to Sentry
      expect(typeError instanceof HttpException).to.equal(false);
      expect(refError instanceof HttpException).to.equal(false);
    });
  });
});
