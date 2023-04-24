import { RequestHandler } from './request-handler';
import { matchPath, normalizePath } from '../utils/url/path/match-path';
import { Requester } from './requester';
import { HTTPVerbs } from '../enums/http-verbs';
import { flattenArray } from '../utils/fn/flatten-array';
import { getParams } from '../utils/url/params/get-params';

export class Route extends RequestHandler {
  constructor(public pathOrPattern: string | RegExp) {
    super();
  }

  canHandle(req: Requester): boolean {
    if (
      this.pathOrPattern !== '' &&
      (this.methods.includes(req.method) ||
        this.methods.includes(HTTPVerbs.ALL))
    )
      return matchPath(req.path, this.pathOrPattern, req.strict);
    return false;
  }

  use(...args: any[]): Route {
    const flatten = flattenArray(...args);
    for (const handler of flatten) {
      if (typeof handler == 'function') {
        if (handler.length == 1) this.errorHandlers.push(handler);
        else this.handlers.push(handler);
      }
    }
    return this;
  }

  _handle_methods(method: HTTPVerbs, ...args: any[]): Route {
    if (!this.methods.includes(method)) this.methods.push(method);
    const flattenArgs = flattenArray(...args);

    if (flattenArgs.length <= 0)
      throw new Error('invalid args for handling method');

    for (const handler of flattenArgs) {
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

  protected async handleRequest() {
    for (const handler of this.handlers) {
      if (this.res.isDone) break;
      if (typeof handler == 'function') {
        this.req.params = getParams(this.req.path, this.pathOrPattern);
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
