import {
  ErrorHandler,
  AsyncErrorHandler,
  isAsyncErrorHandler,
  isErrorHandler,
} from '../interfaces/error-handler';
import {
  AsyncMiddleware,
  isAsyncMiddleware,
  isMiddleware,
  Middleware,
} from '../interfaces/middleware';
import {
  isRequestHandler,
  RequestHandler,
} from '../interfaces/request-handler';
import { Requester } from './requester';
import { Responder } from './responder';
import { Route } from './route';

import { isPromise } from '../utils/fn/is-promise';

export class Router implements RequestHandler {
  #index: number = -1;
  #handlers: (
    | Middleware
    | AsyncMiddleware
    | ErrorHandler
    | AsyncErrorHandler
    | RequestHandler
  )[] = [];
  #req: Requester | undefined;
  #res: Responder | undefined;

  #next(err?: any): void {
    if (!this.#req || !this.#res)
      throw new Error('No request found or responder object is not created.');
    if (this.#handlers.length > this.#index + 1) {
      let returnValue: void | Promise<void> | boolean;
      const handler = this.#handlers[++this.#index];
      if (!err && isMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next);
      if (!err && isAsyncMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next).then(() => {});
      else if (err && isErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next);
      else if (err && isAsyncErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next);
      else if (!err && handler instanceof Route && handler.canHandle(this.#req))
        returnValue = handler.handle(this.#req, this.#res);
      else if (handler instanceof Route && handler.canHandle(this.#req))
        returnValue = handler.handle(this.#req, this.#res, err);
      if (isPromise<void>(returnValue)) returnValue.then(() => {});
    }
  }

  canHandle(req: Requester): boolean {
    for (const r of this.#handlers)
      if (isRequestHandler(r) && r.canHandle(req)) return true;
    return false;
  }
  async handle(req: Requester, res: Responder, err?: any): Promise<void> {
    this.#req = req;
    this.#res = res;
    this.#index = -1;
    if (!err) this.#next();
    else this.#next(err);
    this.#index = -1;
  }
}
