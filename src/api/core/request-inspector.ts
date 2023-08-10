import { HTTPVerbs, stringToHTTPVerbs } from '../enums/http-verbs';
import { parseBody } from '../utils/request/parse-body';
import { parseQuery } from '../utils/url/query/parse-query';
import { parse as parseCookie } from 'cookie';

/**
 * this class inspects the `Request` and exposes its details
 */
export class RequestInspector {
  //#region privates
  #url: URL;
  #query: Record<string, string>;
  #params: Record<string, string>;
  #data: Record<string, any>;
  #method: HTTPVerbs;
  #cookies: Record<string, string>;
  body: any;
  //#endregion

  /**
   *
   * @param request cloudflare workers' Request object
   */
  constructor(
    public readonly request: Request,
    public strict: boolean = false
  ) {
    this.#url = new URL(request.url);
    this.#query = parseQuery(this.url);
    this.#cookies = parseCookie(request.headers.get('Cookie') || '');
    this.#params = {};
    this.#data = {};
    this.#method = stringToHTTPVerbs(request.method);
  }

  static fromRequest = async (
    req: Request,
    strict: boolean = false
  ): Promise<RequestInspector> => {
    const reqer = new RequestInspector(req, strict);
    reqer.body = await parseBody(req);
    return reqer;
  };

  get method() {
    return this.#method;
  }

  get cookies() {
    return this.#cookies;
  }

  get url() {
    return this.#url;
  }
  get path() {
    return this.#url.pathname;
  }
  get query() {
    return this.#query;
  }
  get params() {
    return this.#params;
  }
  get data() {
    return this.#data;
  }

  set params(obj: Record<string, any>) {
    this.#params = { ...this.#params, ...obj };
  }

  set data(obj: Record<string, any>) {
    this.#data = { ...this.#data, ...obj };
  }
}
