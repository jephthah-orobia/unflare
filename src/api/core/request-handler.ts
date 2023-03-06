import { HTTPVerbs } from '../enums/http-verbs';
import { ErrorHandler } from '../interfaces/error-handler';
import { isMiddleware, NextFunction } from '../interfaces/middleware';
import { isRouteHandler } from '../interfaces/route-handler';
import { getParams } from '../utils/url/params/get-params';
import { Requester } from './requester';
import { Responder } from './responder';

/**
 * A Generic Class for Handling Request. Intended to be inherited by Route and Router
 * - `T` - any handler except for ErrorHandler
 */
export abstract class RequestHandler<T> {
  pathOrPattern: string | RegExp = '';
  abstract canHandle(req: Requester): boolean;
  abstract use(...args: any[]): any;
  abstract _handle_methods(
    method: HTTPVerbs,
    ...args: any[]
  ): RequestHandler<T>;

  get path(): string {
    if (!this.pathOrPattern) return '';
    return this.pathOrPattern instanceof RegExp
      ? this.pathOrPattern.source.replaceAll('\\/', '/')
      : this.pathOrPattern;
  }

  constructor() {
    if (!this.canHandle || !this._handle_methods)
      throw new Error('Abstract classes cannot be instantiated');
  }

  protected req: Requester | undefined;
  protected res: Responder | undefined;

  protected methods: HTTPVerbs[] = [];

  protected handlersIndex: number = -1; // handler index
  protected errorHandlersIndex: number = -1; // error handler index;
  protected handlers: T[] = [];
  protected errorHandlers: ErrorHandler[] = [];
  protected error: any;

  tryToHandle = async (
    req: Requester,
    res: Responder,
    next?: NextFunction
  ): Promise<void> => {
    if (!this.canHandle(req)) {
      if (next) await next();
      return;
    }

    this.handlersIndex = -1;
    this.errorHandlersIndex = -1;

    try {
      if (this.pathOrPattern !== '')
        req.params = getParams(req.path, this.pathOrPattern);
      this.res = res;
      this.req = req;
      await this.next();
      if (next) await next();
    } catch (e) {
      await this.next(e);
      if (!this.res?.isDone && !!next) await next(this.error);
      else if (!this.res?.isDone) throw this.error;
    }
  };

  next = async (err?: any): Promise<void> => {
    if (!this?.req || !this?.res) {
      throw new ReferenceError(
        `${this} or it's req property or res property is undefined`
      );
    }

    if (this.res?.isDone) return;

    if (!err && this.handlers.length > ++this.handlersIndex) {
      // handle if there is no error and if there is available handler
      const handler = this.handlers[this.handlersIndex];
      // if handler is also a collection of handler
      if (handler instanceof RequestHandler)
        await handler.tryToHandle(this.req, this.res, this.next);
      // if this is a route and handler is an 'end point'
      else if (
        this.pathOrPattern &&
        isRouteHandler(handler) &&
        (handler.method == this.req.method || handler.method == HTTPVerbs.ALL)
      )
        await handler(this.req, this.res);
      // if handler is a middle ware, this.next should be attach
      else if (
        isMiddleware(handler) &&
        (handler.method == this.req.method || handler.method == HTTPVerbs.ALL)
      )
        await handler(this.req, this.res, this.next);
    } else if (this.errorHandlers.length > ++this.errorHandlersIndex) {
      // handle if there was an error and if there is an available error handler
      try {
        await this.errorHandlers[this.errorHandlersIndex](
          err,
          this.req,
          this.res,
          this.next
        );
      } catch (e) {
        await this.next(e);
        if (!this.res.isDone) {
          this.error = e;
        }
      }
    } else this.error = err;
  };

  //#region Methods
  head = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.HEAD, ...args);
  };
  get = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.GET, ...args);
  };
  post = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.POST, ...args);
  };
  put = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.PUT, ...args);
  };
  patch = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.PATCH, ...args);
  };
  delete = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.DELETE, ...args);
  };
  connect = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.CONNECT, ...args);
  };
  trace = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.TRACE, ...args);
  };
  options = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.OPTIONS, ...args);
  };
  all = (...args: any[]): RequestHandler<T> => {
    return this._handle_methods(HTTPVerbs.ALL, ...args);
  };
  //#endregion
}
