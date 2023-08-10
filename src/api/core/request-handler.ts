import { HTTPVerbs } from '../enums/http-verbs';
import { RequestInspector } from './request-inspector';
import { ResponseFactory } from './response-factory';

/**
 * A Generic Class for Handling Request. Intended to be inherited by Route and Router
 */
export abstract class RequestHandler {
  abstract canHandle(req: RequestInspector): boolean;
  abstract use(...args: Function[]): any;
  abstract _handle_methods(method: HTTPVerbs, ...args: any[]): any;
  protected abstract handleRequest(): void | Promise<void>;

  constructor() {
    if (!this.canHandle || !this._handle_methods)
      throw new Error('Abstract classes cannot be instantiated');
  }

  private _env?: any;
  private _req!: RequestInspector;
  private _res!: ResponseFactory;

  /**
   * - contains the `env` object that holds the KV bindings.
   * - read more obout [KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
   */
  get ENV(): any {
    return this._env;
  }

  get req(): RequestInspector {
    return this._req;
  }

  get res(): ResponseFactory {
    return this._res;
  }

  get data(): Record<string, any> {
    return this._req.data;
  }

  get params(): Record<string, any> {
    return this._req.params;
  }

  get query(): Record<string, string> {
    return this._req.query;
  }

  get body(): any {
    return this._req.body;
  }

  get cookies(): Record<string, string> {
    return this._req.cookies;
  }

  public methods: HTTPVerbs[] = [];

  protected handlers: (Function | RequestHandler)[] = [];
  protected errorHandlers: ((err: any) => any | Promise<any>)[] = [];

  tryToHandle = async (
    req: RequestInspector,
    res: ResponseFactory,
    env?: any
  ): Promise<void> => {
    if (!this.canHandle(req)) return;

    this._res = res;
    this._req = req;
    this._env = env;
    await this.handleRequest();
  };

  protected async handleError(err: any) {
    for (const eHandler of this.errorHandlers) {
      if (this.res.isDone || !err) break;
      if (typeof eHandler == 'function') await eHandler.apply(this, [err]);
    }
  }

  //#region Methods
  head = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.HEAD, ...args);
  };
  get = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.GET, ...args);
  };
  post = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.POST, ...args);
  };
  put = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.PUT, ...args);
  };
  patch = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.PATCH, ...args);
  };
  delete = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.DELETE, ...args);
  };
  connect = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.CONNECT, ...args);
  };
  trace = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.TRACE, ...args);
  };
  options = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.OPTIONS, ...args);
  };
  all = (...args: any[]): RequestHandler => {
    return this._handle_methods(HTTPVerbs.ALL, ...args);
  };
  //#endregion
}
