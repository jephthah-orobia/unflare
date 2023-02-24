import { HTTPVerbs, stringToHTTPVerbs } from '../enums/http-verbs';
import { parseBody } from '../utils/request/parse-body';
import { getParams } from '../utils/url/params/get-params';
import { parseQuery } from '../utils/url/query/parse-query';

export class Requester {
  //#region privates
  #url: URL;
  #query: { [key: string]: string };
  #params: { [key: string]: string };
  #data: { [key: string]: any };
  #method: HTTPVerbs;
  body: any;
  //#endregion

  /**
   * Instance of this class is use by unflare as first argument for middlewares and route callbacks
   * @param request cloudflare workers' Request object
   */
  constructor(
    public readonly request: Request,
    public strict: boolean = false
  ) {
    this.#url = new URL(request.url);
    this.#query = parseQuery(this.url);
    this.#params = {};
    this.#data = {};
    this.#method = stringToHTTPVerbs(request.method);
  }

  static fromRequest = async (
    req: Request,
    strict: boolean = false
  ): Promise<Requester> => {
    const reqer = new Requester(req, strict);
    reqer.body = await parseBody(req);
    return reqer;
  };

  get method(): HTTPVerbs {
    return this.#method;
  }
  get url(): URL {
    return this.#url;
  }
  get path(): string {
    return this.#url.pathname;
  }
  get query(): { [key: string]: string } {
    return this.#query;
  }
  get params(): { [key: string]: string } {
    return this.#params;
  }
  get data(): { [key: string]: any } {
    return { ...this.#data };
  }

  set params(obj: { [key: string]: string }) {
    this.#params = { ...this.#params, ...obj };
  }
  set data(obj: { [key: string]: any }) {
    this.#data = { ...this.#data, ...obj };
  }
}
