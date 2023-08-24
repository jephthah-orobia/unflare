import { HTTPVerbs } from '../enums/http-verbs';
import { RequestInspector } from './request-inspector';
import { ResponseFactory } from './response-factory';

/**
 * A Generic Class for Handling Request. Intended to be inherited by Route and Router
 */
export abstract class RequestHandler {
  abstract canHandle(req: RequestInspector): boolean;
  abstract use(...args: (Function | RequestHandler)[]): any;
  abstract _handle_methods(method: HTTPVerbs, ...args: any[]): any;
  protected abstract handleRequest(): void | Promise<void>;
  #pre_fetch: Function[] = [];
  #post_fetch: Function[] = [];

  constructor() {
    if (!this.canHandle || !this._handle_methods)
      throw new Error('Abstract classes cannot be instantiated');
  }

  private _env?: Record<string, string>;
  private _req!: RequestInspector;
  private _res!: ResponseFactory;

  /**
   * - contains the `env` object that holds the KV bindings.
   * - read more obout [KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
   */
  get ENV(): Record<string, string> {
    return this._env || {};
  }

  get env(): Record<string, string> {
    return this._env || {};
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

  get headers(): any {
    return this._req.request.headers;
  }

  get cookies(): Record<string, string> {
    return this._req.cookies;
  }

  public methods: HTTPVerbs[] = [];

  protected handlers: (Function | RequestHandler)[] = [];

  protected errorHandlers: ((
    app: RequestHandler,
    err: any
  ) => any | Promise<any>)[] = [];

  beforeEach(...args: Function[]): void {
    this.#pre_fetch.push(...args);
  }

  afterEach(...args: Function[]): void {
    this.#post_fetch.push(...args);
  }

  tryToHandle = async (
    req: RequestInspector,
    res: ResponseFactory,
    env?: any
  ): Promise<void> => {
    if (!this.canHandle(req)) return;

    this._res = res;
    this._req = req;
    this._env = env;
    this.#pre_fetch.forEach(async (e) => await e());
    await this.handleRequest();

    this.#post_fetch.forEach(async (e) => await e());
  };

  protected async handleError(err: any) {
    for (const eHandler of this.errorHandlers) {
      if (this.res.isDone || !err) break;
      if (typeof eHandler == 'function') await eHandler(this, err);
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
