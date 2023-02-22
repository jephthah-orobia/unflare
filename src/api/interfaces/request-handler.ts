import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { Route } from '../core/route';

export interface RequestHandler {
  canHandle(req: Requester): boolean;
  routeOfPath(path: string | RegExp): Route | null;
  handle(req: Requester, res: Responder, err?: any): Promise<void>;
}

export const isRequestHandler = (obj: any): obj is RequestHandler => {
  if (
    !obj.canHandle ||
    typeof obj.canHandle !== 'function' ||
    obj.canHandle.length !== 1
  )
    return false;
  if (
    !obj.routeOfPath ||
    typeof obj.routeOfPath !== 'function' ||
    obj.routeOfPath.length !== 1
  )
    return false;
  if (
    !obj.handle ||
    typeof obj.handle !== 'function' ||
    obj.handle.length < 2 ||
    obj.handle.length > 3
  )
    return false;
  return true;
};
