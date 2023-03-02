import { describe, it, expect } from 'vitest';
import { RequestHandler } from './request-handler';

describe('class RequestHandler', () => {
  describe('constructor()', () => {
    it('should throw an error', () => {
      //@ts-expect-error
      expect(new RequestHandler()).toThrowError();
    });
  });
  describe.todo('tryToHandle()');
  describe.todo('handleError()');
  describe.todo('routeOfPath()');
});
