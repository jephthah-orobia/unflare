import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { Route } from '../core/route';

export interface RequestHandler {
  canHandle(req: Requester): boolean;
  routeOfPath(path: String | RegExp): Route | null;
  handle(req: Requester, res: Responder, err?: any): Promise<void>;
}

export const isRequestHandler = (obj: any): obj is RequestHandler => {
  const props = ['canHandle', 'routeOfPath', 'handle'];
  const keys = Object.keys(obj);
  const types = keys.map((k) => props.includes(k) && typeof obj[k]);
  return (
    types.every((t) => t === 'function') && props.every((p) => keys.includes(p))
  );
};
