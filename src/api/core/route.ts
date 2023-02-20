import { HTTPVerbs, stringToHTTPVerbs } from '../enums/http-verbs';
import {
  AsyncErrorHandler,
  ErrorHandler,
  isAsyncErrorHandler,
  isErrorHandler,
} from '../interfaces/error-handler';
import {
  AsyncMiddleware,
  isAsyncMiddleware,
  isMiddleware,
  Middleware,
} from '../interfaces/middleware';
import { RequestHandler } from '../interfaces/request-handler';
import {
  AsyncRouteHandler,
  isAsyncRouteHandler,
  isRouteHandler,
  RouteHandler,
} from '../interfaces/route-handler';
import { Requester } from './requester';
import { Responder } from './responder';
import { isPromise } from '../utils/fn/is-promise';
import { matchPath } from '../utils/url/path/match-path';
import { flattenArray } from '../utils/fn/flatten-array';
import { getParams } from '../utils/url/params/get-params';

type Handler =
  | RouteHandler
  | AsyncRouteHandler
  | Middleware
  | AsyncMiddleware
  | ErrorHandler
  | AsyncErrorHandler;

const isHandler = (obj: any): obj is Handler => {
  return (
    isRouteHandler(obj) ||
    isAsyncRouteHandler(obj) ||
    isMiddleware(obj) ||
    isAsyncMiddleware(obj) ||
    isErrorHandler(obj) ||
    isAsyncErrorHandler(obj)
  );
};

type MidwareOrErrorHandler =
  | Middleware
  | AsyncMiddleware
  | ErrorHandler
  | AsyncErrorHandler;

export class Route implements RequestHandler {
  #methods: HTTPVerbs[] = [];
  #handlers: Handler[] = [];
  #req: Requester | undefined;
  #res: Responder | undefined;
  #index: number = -1;
  constructor(private pathOrPattern: string | RegExp) {}

  matchPath(path: String | RegExp): boolean {
    const pathStr = path instanceof RegExp ? path.source : path;
    return this.path === pathStr;
  }

  get path(): string {
    return this.pathOrPattern instanceof RegExp
      ? this.pathOrPattern.source
      : this.pathOrPattern;
  }
  #next(err?: any): void {
    if (!this.#req || !this.#res)
      throw new Error('No request found or responder object is not created.');
    if (this.#handlers.length > this.#index + 1) {
      let returnValue: void | Promise<void> | boolean;
      const handler = this.#handlers[++this.#index];
      if (!err && isMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next);
      else if (!err && isAsyncMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next).then(() => {});
      else if (
        !err &&
        isRouteHandler(handler) &&
        (this.#req.method === handler.method ||
          handler.method === HTTPVerbs.ALL)
      )
        returnValue = handler(this.#req, this.#res);
      else if (
        !err &&
        isAsyncRouteHandler(handler) &&
        (this.#req.method === handler.method ||
          handler.method === HTTPVerbs.ALL)
      )
        returnValue = handler(this.#req, this.#res).then(() => {});
      else if (err && isErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next);
      else if (err && isAsyncErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next).then(
          () => {}
        );
      if (isPromise<void>(returnValue)) returnValue.then(() => {});
    }
  }

  _handle_methods(method: HTTPVerbs, ...args: (Handler | Handler[])[]) {
    if (!this.#methods.includes(method)) this.#methods.push(method);
    const flattenArgs = flattenArray(...args);
    for (const handler of flattenArgs) {
      if (isHandler(handler)) {
        if (isRouteHandler(handler) || isAsyncRouteHandler(handler))
          handler.method = method;
        this.#handlers.push(handler);
      }
    }
  }

  canHandle(req: Requester): boolean {
    if (
      !this.#methods.includes(req.method) &&
      !this.#methods.includes(HTTPVerbs.ALL)
    )
      return false;
    return matchPath(req.url.pathname, this.pathOrPattern);
  }

  async handle(req: Requester, res: Responder, err?: any): Promise<void> {
    this.#req = req;
    this.#res = res;
    if (this.canHandle(req)) {
      this.#index = -1;
      this.#req.params = getParams(this.#req.path, this.pathOrPattern);
      if (!err) this.#next();
      else this.#next(err);
    }
    this.#index = -1;
  }

  use(...args: (MidwareOrErrorHandler | MidwareOrErrorHandler[])[]): void {
    const flattenArgs = flattenArray(...args);
    for (const e of flattenArgs) {
      if (isHandler(e)) this.#handlers.push(e);
    }
  }
}

export declare interface Route {
  head(...args: (Handler | Handler[])[]): void;
  get(...args: (Handler | Handler[])[]): void;
  post(...args: (Handler | Handler[])[]): void;
  put(...args: (Handler | Handler[])[]): void;
  patch(...args: (Handler | Handler[])[]): void;
  delete(...args: (Handler | Handler[])[]): void;
  connect(...args: (Handler | Handler[])[]): void;
  trace(...args: (Handler | Handler[])[]): void;
  options(...args: (Handler | Handler[])[]): void;
  all(...args: (Handler | Handler[])[]): void;
  [index: string]: Function | string | RegExp;
}

for (const verb in HTTPVerbs) {
  Route.prototype[verb.toLowerCase()] = function (
    ...args: (Handler | Handler[])[]
  ): void {
    this._handle_methods(stringToHTTPVerbs(verb), ...args);
  };
}
