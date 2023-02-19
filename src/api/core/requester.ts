import { HTTPVerbs, stringToHTTPVerbs } from '../enums/http-verbs';
import { parseQuery } from '../utils/url/query/parse-query';

export class Requester {
  //#region privates
  #url: URL;
  #query: { [key: string]: string };
  #params: { [key: string]: string };
  #data: { [key: string]: any };
  #method: HTTPVerbs;
  //#endregion

  /**
   * Instance of this class is use by unflare as first argument for middlewares and route callbacks
   * @param request cloudflare workers' Request object
   */
  constructor(public readonly request: Request) {
    this.#url = new URL(request.url);
    this.#query = parseQuery(this.url);
    this.#params = {};
    this.#data = {};
    this.#method = stringToHTTPVerbs(request.method);
  }

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
}
