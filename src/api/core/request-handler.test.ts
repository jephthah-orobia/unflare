import { describe, it, expect } from 'vitest';
import { RequestHandler } from './request-handler';

describe('class RequestHandler', () => {
  describe('constructor()', () => {
    it('should throw an error if instantiated without being extended', () => {
      //@ts-expect-error
      expect(() => new RequestHandler()).toThrowError();
    });
  });
});

// most of this class' functionality are on Route and Router, hence, test are done there.
