import { Requester } from '../core/requester';
import { Responder } from '../core/responder';

export type RouteHandler = (req: Requester, res: Responder) => void;

export type AsyncRouteHandler = (
  req: Requester,
  res: Responder
) => Promise<void>;

export const isRouteHandler = (obj: any): obj is RouteHandler => {
  return obj.constructor.name === 'Function' && obj.length === 2;
};
export const isAsyncRouteHandler = (obj: any): obj is AsyncRouteHandler => {
  return obj.constructor.name === 'AsyncFunction' && obj.length === 2;
};
