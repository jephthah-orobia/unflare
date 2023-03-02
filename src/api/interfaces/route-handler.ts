import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { HTTPVerbs } from '../enums/http-verbs';

export type RouteHandler = {
  (req: Requester, res: Responder): void | Promise<void>;
  method: HTTPVerbs;
};

export const isRouteHandler = (obj: any): obj is RouteHandler => {
  return obj.constructor.name === 'Function' && obj.length === 2;
};
export const isSyncRouteHandler = (
  obj: any
): obj is {
  (req: Requester, res: Responder): void;
  method: HTTPVerbs;
} => {
  return obj.constructor.name === 'Function' && obj.length === 2;
};
export const isAsyncRouteHandler = (
  obj: any
): obj is {
  (req: Requester, res: Responder): Promise<void>;
  method: HTTPVerbs;
} => {
  return obj.constructor.name === 'AsyncFunction' && obj.length === 2;
};
