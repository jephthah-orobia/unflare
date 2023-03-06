import { isMiddleware, Middleware } from '../interfaces/middleware';
import { Route } from './route';
import { RequestHandler } from './request-handler';
import { Requester } from './requester';
import { HTTPVerbs } from '../enums/http-verbs';
import { flattenArray } from '../utils/fn/flatten-array';
import { isErrorHandler } from '../interfaces/error-handler';

export class Router extends RequestHandler<Middleware | Router | Route> {
  canHandle(req: Requester): boolean {
    if (
      this.methods.includes(req.method) ||
      this.methods.includes(HTTPVerbs.ALL)
    )
      return this.handlers.some(
        (handler) => handler instanceof RequestHandler && handler.canHandle(req)
      );
    return false;
  }

  routeOfPath(path: string | RegExp): Route | null {
    for (const handler of this.handlers)
      if (handler instanceof RequestHandler) {
        const route = handler.routeOfPath(path);
        if (route) return route;
      }
    return null;
  }

  use(...args: any[]): Router {
    const flatten = flattenArray(...args);
    for (const handler of flatten) {
      if (isErrorHandler(handler)) this.errorHandlers.push(handler);
      else if (isMiddleware(handler)) handler.method = HTTPVerbs.ALL;
      else if (
        isMiddleware(handler) ||
        handler instanceof Router ||
        handler instanceof Route
      )
        this.handlers.push(handler);
    }
    return this;
  }

  _handle_methods(method: HTTPVerbs, ...args: any[]): Route | Router {
    if (!this.methods.includes(method)) this.methods.push(method);

    const handlers = flattenArray(...args);

    if (handlers.length <= 0)
      throw new Error('invalid args for handling method');

    if (typeof handlers[0] === 'string' || handlers[0] instanceof RegExp) {
      const path = handlers.shift();
      const route = this.route(path);
      return route._handle_methods(method, ...handlers);
    } else {
      for (const handler of handlers) {
        if (isErrorHandler(handler)) this.errorHandlers.push(handler);
        else if (isMiddleware(handler)) {
          handler.method = method;
          this.handlers.push(handler);
        }
      }
      return this;
    }
  }

  route(path: string | RegExp): Route {
    const route = this.routeOfPath(path);
    if (!route) {
      const newRoute = new Route(path);
      this.handlers.push(newRoute);
      return newRoute;
    }
    return route;
  }
}
