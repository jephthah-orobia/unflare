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
import { flattenArray } from '../utils/fn/flatten-array';
import { HTTPVerbs, stringToHTTPVerbs } from '../enums/http-verbs';
import {
  AsyncRouteHandler,
  isAsyncRouteHandler,
  isRouteHandler,
  RouteHandler,
} from '../interfaces/route-handler';

type Handler =
  | Middleware
  | AsyncMiddleware
  | ErrorHandler
  | AsyncErrorHandler
  | RequestHandler;

const isHandler = (obj: any): obj is Handler => {
  return (
    isMiddleware(obj) ||
    isAsyncMiddleware(obj) ||
    isErrorHandler(obj) ||
    isAsyncErrorHandler(obj) ||
    isRequestHandler(obj)
  );
};

type RouteHandlers =
  | RouteHandler
  | AsyncRouteHandler
  | Middleware
  | AsyncMiddleware
  | ErrorHandler
  | AsyncErrorHandler;

const isRouteHandlers = (obj: any): obj is Handler => {
  return (
    isRouteHandler(obj) ||
    isAsyncRouteHandler(obj) ||
    isMiddleware(obj) ||
    isAsyncMiddleware(obj) ||
    isErrorHandler(obj) ||
    isAsyncErrorHandler(obj)
  );
};

export class Router implements RequestHandler {
  #index: number = -1;
  #handlers: Handler[] = [];
  #req: Requester | undefined;
  #res: Responder | undefined;

  #next(err?: any): void {
    if (!this.#req || !this.#res)
      throw new Error('No request found or responder object is not created.');
    if (this.#res.isDone) return;
    if (this.#handlers.length > this.#index + 1) {
      let returnValue: void | Promise<void> | boolean;
      const handler = this.#handlers[++this.#index];
      if (!err && isMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next);
      else if (!err && isAsyncMiddleware(handler))
        returnValue = handler(this.#req, this.#res, this.#next).then(() => {});
      else if (err && isErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next);
      else if (err && isAsyncErrorHandler(handler))
        returnValue = handler(err, this.#req, this.#res, this.#next);
      else if (err && isRequestHandler(handler) && handler.canHandle(this.#req))
        returnValue = handler.handle(this.#req, this.#res, err);
      else if (
        !err &&
        isRequestHandler(handler) &&
        handler.canHandle(this.#req)
      )
        returnValue = handler.handle(this.#req, this.#res);
      else if (
        !err &&
        isRequestHandler(handler) &&
        !handler.canHandle(this.#req)
      )
        this.#next();
      if (isPromise<void>(returnValue)) returnValue.then(() => {});
    }
  }

  get handlers() {
    return this.#handlers;
  }

  routeOfPath(path: string | RegExp): Route | null {
    for (const handler of this.#handlers)
      if (isRequestHandler(handler)) {
        const route = handler.routeOfPath(path);
        if (route) return route;
      }
    return null;
  }

  canHandle(req: Requester): boolean {
    return this.#handlers.some(
      (handler) => isRequestHandler(handler) && handler.canHandle(req)
    );
  }

  async handle(req: Requester, res: Responder, err?: any): Promise<void> {
    this.#req = req;
    this.#res = res;
    this.#index = -1;
    if (!err) this.#next();
    else this.#next(err);
    this.#req = undefined;
    this.#res = undefined;
  }

  route(pathOrPattern: string | RegExp): Route {
    const route = this.routeOfPath(pathOrPattern);
    if (!route) {
      const newRoute = new Route(pathOrPattern);
      this.#handlers.push(newRoute);
      return newRoute;
    }
    return route;
  }

  use(...args: Handler[]): Router {
    const flattenArgs = flattenArray(...args);
    for (const e of flattenArgs) {
      if (isHandler(e)) this.#handlers.push(e);
    }
    return this;
  }

  _handle_methods(
    method: HTTPVerbs,
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router {
    const route: Route = this.route(path);
    route._handle_methods(method, ...args);
    return this;
  }
}

export declare interface Router {
  head(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  get(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  post(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  put(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  patch(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  delete(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  connect(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  trace(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  options(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  all(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;

  [index: string]: any;
}

for (const verb in HTTPVerbs) {
  Router.prototype[verb.toLowerCase()] = function (
    pathOrPattern: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router {
    return this._handle_methods(
      stringToHTTPVerbs(verb),
      pathOrPattern,
      ...args
    );
  };
}
