import { CookieOptions } from '../interfaces/cookie-options';
import mime from 'mime-types';

export class Responder {
  #defaultCookieOptions: CookieOptions;
  isDone: boolean = false;
  statusCode: number | undefined;
  statusText: string | undefined;
  headers: Map<string, string> = new Map<string, string>();
  body: any;

  constructor(private host: string) {
    this.#defaultCookieOptions = {
      domain: this.host,
      encode: encodeURIComponent,
      httpOnly: false,
      path: '/',
      secure: false,
      signed: false,
    };
  }

  get response() {
    if (!this.isDone) return null;
    let init: { status?: number; statusText?: string } = {},
      res;
    if (this.statusCode || this.statusText) {
      if (this.statusCode) init.status = this.statusCode;
      if (this.statusText) init.statusText = this.statusText;
      res = new Response(this.body, init);
    } else res = new Response(this.body);

    for (const [key, value] of this.headers) res.headers.set(key, value);

    return res;
  }

  status = (code: number, text?: string): Responder => {
    this.statusCode = code;
    if (text) this.statusText = text;
    return this;
  };

  send(body?: any) {
    if (!this.isDone) {
      this.body = body;
      this.isDone = true;
    } else {
      console.error('Can not change response once sent.');
    }
  }

  json(obj: any) {
    this.headers.set('Content-Type', mime.contentType('json') as string);
    this.send(JSON.stringify(obj));
  }

  /**
   * Sets the cookie
   * @param name name of the cookiie
   * @param value value of the cookie
   * @param options can have the following properties:
   * - `domain`:	`String`	Domain name for the cookie. Defaults to the domain name of the app.
   * - `encode`:	`Function`	A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.
   * - `expires`:	`Date`	Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
   * - `httpOnly`:	`Boolean`	Flags the cookie to be accessible only by the web server.
   * - `maxAge`:	`Number`	Convenient option for setting the expiry time relative to the current time in milliseconds.
   * - `path`:  `String`	Path for the cookie. Defaults to “/”.
   * - `priority`:	`String`	Value of the “Priority” Set-Cookie attribute.
   * - `secure`:	`Boolean`	Marks the cookie to be used with HTTPS only.
   * - `signed`:	`Boolean`	Indicates if the cookie should be signed.
   * - `sameSite`:	Boolean or String	Value of the “SameSite” Set-Cookie attribute. For more information, [click here](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1).
   */
  cookie(name: string, value: string, options: CookieOptions): Responder {
    const opts = { ...this.#defaultCookieOptions, ...options };
    //TODO
    return this;
  }
}
