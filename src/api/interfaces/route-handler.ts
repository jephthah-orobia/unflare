import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { HTTPVerbs } from '../enums/http-verbs';

export type RouteHandler = {
  (req: Requester, res: Responder): void | Promise<void>;
  method: HTTPVerbs;
};

export const isRouteHandler = (obj: any): obj is RouteHandler => {
  return typeof obj === 'function' && obj.length === 2;
};
