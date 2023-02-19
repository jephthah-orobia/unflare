import { Requester } from '../core/requester';
import { Responder } from '../core/responder';

export type NextFunction = (err?: any) => void;

export type Middleware = (
  req: Requester,
  res: Responder,
  next: NextFunction
) => void;

export type AsyncMiddleware = (
  req: Requester,
  res: Responder,
  next: NextFunction
) => Promise<void>;

export const isMiddleware = (obj: any): obj is Middleware => {
  return obj.constructor.name === 'Function' && obj.length == 3;
};

export const isAsyncMiddleware = (obj: any): obj is AsyncMiddleware => {
  return obj.constructor.name === 'AsyncFunction' && obj.length == 3;
};
