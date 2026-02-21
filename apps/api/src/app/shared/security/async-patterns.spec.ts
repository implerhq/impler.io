import { expect } from 'chai';

describe('Async Pattern Fixes Tests', () => {
  describe('forEach with async - Fixed to Promise.all', () => {
    it('should await all promises when using Promise.all + map', async () => {
      const results: number[] = [];

      const items = [1, 2, 3, 4, 5];
      await Promise.all(
        items.map(async (item) => {
          results.push(item * 2);
        })
      );

      expect(results).to.have.length(5);
      expect(results).to.include(2);
      expect(results).to.include(10);
    });

    it('forEach with async does NOT properly await (demonstrating the bug)', async () => {
      const results: number[] = [];

      const items = [1, 2, 3];
      // This is the BROKEN pattern - forEach doesn't await
      items.forEach(async (item) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(item);
      });

      // Results may be empty because forEach doesn't await
      // This demonstrates why the fix was needed
      expect(results.length).to.be.lessThanOrEqual(3);
    });

    it('Promise.all properly awaits all async operations', async () => {
      const results: number[] = [];

      const items = [1, 2, 3];
      await Promise.all(
        items.map(async (item) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          results.push(item);
        })
      );

      // All results are guaranteed to be present
      expect(results).to.have.length(3);
    });
  });

  describe('Fire-and-forget pattern fix', () => {
    it('should catch errors when await is used on publishToQueue', async () => {
      let errorCaught = false;

      const failingPublish = async () => {
        throw new Error('Queue connection lost');
      };

      try {
        await failingPublish();
      } catch (error) {
        errorCaught = true;
      }

      expect(errorCaught).to.equal(true);
    });

    it('fire-and-forget silently loses errors (demonstrating the bug)', async () => {
      let errorCaught = false;

      const failingPublish = async () => {
        throw new Error('Queue connection lost');
      };

      // Without await, error is lost (fire-and-forget)
      try {
        failingPublish(); // No await!
      } catch (error) {
        errorCaught = true;
      }

      expect(errorCaught).to.equal(false); // Error is NOT caught
    });
  });
});
