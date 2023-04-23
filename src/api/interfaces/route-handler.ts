import { Requester } from '../core/requester';
import { ResponseFactory } from '../core/response-factory';
import { HTTPVerbs } from '../enums/http-verbs';

export type RouteHandler = {
  (req: Requester, res: ResponseFactory): void | Promise<void>;
  method: HTTPVerbs;
};

export const isRouteHandler = (obj: any): obj is RouteHandler => {
  return typeof obj === 'function' && obj.length === 2;
};
