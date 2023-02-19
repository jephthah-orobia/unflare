export interface CookieOptions {
  /**
   * - `domain`:	`String`	Domain name for the cookie. Defaults to the domain name of the app.
   */
  domain?: string;
  /**
   * - `encode`:	`Function`	A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.
   */
  encode?: Function;
  /**
   * - `expires`:	`Date`	Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
   */
  expires?: Date;
  /**
   * - `httpOnly`:	`Boolean`	Flags the cookie to be accessible only by the web server.
   */
  httpOnly?: boolean;
  /**
   * - `maxAge`:	`Number`	Convenient option for setting the expiry time relative to the current time in milliseconds.
   */
  maxAge?: Number;
  /**
   * `path`:  `String`	Path for the cookie. Defaults to “/”.
   */
  path?: string;
  /**
   * - `priority`:	`String`	Value of the “Priority” Set-Cookie attribute.
   */
  priority?: string;
  /**
   * - `secure`:	`Boolean`	Marks the cookie to be used with HTTPS only.
   */
  secure?: boolean;
  /**
   * - `signed`:	`Boolean`	Indicates if the cookie should be signed.
   */
  signed?: boolean;
  /**
   * - `sameSite`:	Boolean or String	Value of the “SameSite” Set-Cookie attribute. For more information, [click here](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1).
   */
  sameSite?: boolean | string;
}
