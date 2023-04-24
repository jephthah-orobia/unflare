import { Route } from './route';
import { RequestHandler } from './request-handler';
import { Requester } from './requester';
import { HTTPVerbs } from '../enums/http-verbs';
import { flattenArray } from '../utils/fn/flatten-array';

export class Router extends RequestHandler {
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

  use(...args: any[]): Router {
    const flatten = flattenArray(...args);
    for (const handler of flatten) {
      if (typeof handler == 'function' && handler.length == 1)
        this.errorHandlers.push(handler);
      else this.handlers.push(handler);
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
      const route = new Route(path);
      this.handlers.push(route);
      return route._handle_methods(method, ...handlers);
    } else {
      for (const handler of handlers) {
        if (typeof handler == 'function') {
          if (handler.length != 1) {
            handler.method = method;
            this.handlers.push(handler);
          } else this.errorHandlers.push(handler);
        }
        //else ignore the element
      }
      return this;
    }
  }

  protected async handleRequest() {
    for (const handler of this.handlers) {
      if (this.res.isDone) break;
      if (handler instanceof RequestHandler)
        try {
          await handler.tryToHandle(this.req, this.res, this.ENV);
        } catch (e) {
          await this.handleError(e);
          if (!this.res.isDone) {
            throw e;
          }
        }
      else if (typeof handler == 'function') {
        try {
          await handler();
        } catch (e) {
          await this.handleError(e);
          if (!this.res.isDone) {
            throw e;
          }
        }
      }
    }
  }
}
