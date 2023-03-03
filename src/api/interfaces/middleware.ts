import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { HTTPVerbs } from '../enums/http-verbs';

export type NextFunction = (err?: any) => void | Promise<void>;

export type Middleware = {
  (req: Requester, res: Responder, next: NextFunction): void | Promise<void>;
  method: HTTPVerbs;
};

export const isMiddleware = (obj: any): obj is Middleware => {
  return typeof obj === 'function' && obj.length == 3;
};
