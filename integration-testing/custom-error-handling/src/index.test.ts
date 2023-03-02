import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  describe('get: /pathDoesNotExist', async () => {
    // this will inspect if the response was made by the custom error handler
    it('should return a response body with words `by custom`', async () => {
      const res = await worker.fetch('/pathDoesNotExist');
      const resBody = await res.text();
      expect(res.status).toBe(404);
      expect(() => {
        JSON.parse(resBody);
      }).not.throws();
      expect(/by custom/i.test(resBody)).toStrictEqual(true);
    });
  });
});
