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
    it('should return a json response body with property error', async () => {
      const res = await worker.fetch('/pathDoesNotExist');
      const cont_type = res.headers.get('Content-Type');
      expect(cont_type).not.toBeNull();
      if (cont_type) expect(/application\/json/i.test(cont_type)).toBe(true);
      const resBody = await res.json();
      expect(res.status).toBe(404);
      expect(resBody).not.toBeNull();
      expect(resBody).toHaveProperty('errors');
      expect(resBody).toBeDefined();
      //@ts-ignore
      expect(resBody.errors[0]).toBe('Page Not Found.');
    });
  });

  describe('get: /path-that-throws-error', async () => {
    // this will inspect if the response was made by the custom error handler
    it('should return a json response body with property error`', async () => {
      const res = await worker.fetch('/path-that-throws-error');
      const resBody = await res.json();

      expect(res.status).toBe(500);
      expect(resBody).not.toBeNull();
      expect(resBody).toHaveProperty('errors');
      expect(resBody).toBeDefined();
      //@ts-ignore
      expect(resBody.errors[0]).toBe('An error is thrown!');
    });
  });
});
