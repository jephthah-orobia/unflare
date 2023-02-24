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

  it('should return `Hello World` for /', async () => {
    const resp = await worker.fetch();
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(`"Hello World!"`);
    }
  });

  it('should return `Users page` for /', async () => {
    const resp = await worker.fetch('/users');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(`"Users page"`);
    }
  });

  it('should return `User page, you were trying to view: abc123` for /', async () => {
    const resp = await worker.fetch('/users/abc123');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(
        `"User page, you were trying to view: abc123"`
      );
    }
  });
});
