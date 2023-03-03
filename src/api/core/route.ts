import { isMiddleware, Middleware } from '../interfaces/middleware';
import { RequestHandler } from './request-handler';
import { isRouteHandler, RouteHandler } from '../interfaces/route-handler';
import { matchPath } from '../utils/url/path/match-path';
import { Requester } from './requester';
import { HTTPVerbs } from '../enums/http-verbs';
import { flattenArray } from '../utils/fn/flatten-array';
import { isErrorHandler } from '../interfaces/error-handler';

export class Route extends RequestHandler<RouteHandler | Middleware> {
  constructor(path: string | RegExp) {
    super();
    this.pathOrPattern = path;
  }

  routeOfPath(path: string | RegExp): Route | null {
    const pathStr =
      path instanceof RegExp ? path.source.replaceAll('\\/', '/') : path;
    if (
      this.path === pathStr ||
      matchPath(pathStr, this.pathOrPattern!) ||
      matchPath(this.path, path)
    )
      return this;
    else return null;
  }

  canHandle(req: Requester): boolean {
    if (
      this.pathOrPattern !== '' &&
      (this.methods.includes(req.method) ||
        this.methods.includes(HTTPVerbs.ALL))
    )
      return matchPath(req.url.pathname, this.pathOrPattern, req.strict);
    return false;
  }

  use(...args: any[]): Route {
    const flatten = flattenArray(...args);
    for (const handler of flatten) {
      if (isErrorHandler(handler)) this.errorHandlers.push(handler);
      else if (isMiddleware(handler) || isRouteHandler(handler)) {
        handler.method = HTTPVerbs.ALL;
        this.handlers.push(handler);
      }
    }
    return this;
  }

  _handle_methods(method: HTTPVerbs, ...args: any[]): Route {
    if (!this.methods.includes(method)) this.methods.push(method);
    const flattenArgs = flattenArray(...args);

    if (flattenArgs.length <= 0)
      throw new Error('invalid args for handling method');

    // handle if this is a route
    for (const handler of flattenArgs) {
      if (isRouteHandler(handler) || isMiddleware(handler)) {
        handler.method = method;
        this.handlers.push(handler);
      } else if (isErrorHandler(handler)) this.errorHandlers.push(handler);
      //else ignore the element
    }
    return this;
  }
}
