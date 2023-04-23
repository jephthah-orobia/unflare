import { Requester } from './requester';
import { ResponseFactory } from './response-factory';
import { Router } from './router';

export interface UnflareOptions {
  strictRouting?: boolean; //default: false
}

export class Unflare extends Router {
  #pre_fetch: Function[] = [];
  #post_fetch: Function[] = [];

  strict: boolean = false;

  /**
   * - contains the `env` object that holds the KV bindings.
   * - read more obout [KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
  

  constructor(
    // in preparation of additional options in the future
    options: UnflareOptions = {
      strictRouting: false,
    }
  ) {
    super();
    if (options.strictRouting) this.strict = true;
  }

  /**
   * - creates a new `Response` to this to customize 'Not Found Page';
   * - ie: Set to a response with status code `302` to redirect to a static page.
   * - For more information in constructing a response, check worker's docs on [Response](https://developers.cloudflare.com/workers/runtime-apis/response/)
   */
  createNotFoundResponse = (): Response =>
    new Response('Page Not Found!', {
      status: 404,
      statusText: 'Page Not Found!',
    });

  /**
   * Sets the generator function for the `Not Found` page; Make sure to set status to 404
   * @param creator a function that generates a response that will be use for "NOT FOUND PAGE".
   */
  setNotFound(creator: () => Response) {
    this.createNotFoundResponse = creator;
  }

  beforeEach(...args: Function[]): void {
    this.#pre_fetch.push(...args);
  }

  afterEach(...args: Function[]): void {
    this.#post_fetch.push(...args);
  }

  static Router(): Router {
    return new Router();
  }

  async fetch(
    req: Request,
    env?: any,
    ctx?: ExecutionContext
  ): Promise<Response> {
    ctx?.passThroughOnException();

    this.#env = env;

    // call pre hooks
    this.#pre_fetch.forEach(async (e) => await e.apply(this));

    const reqer = await Requester.fromRequest(req, this.strict);
    const reser = new ResponseFactory(reqer.url.host);
    let err: any = false;

    try {
      await this.tryToHandle(reqer, reser);
    } catch (e: any) {
      console.error(e);
      err = e;
    }

    // call post hooks
    this.#post_fetch.forEach(async (e) => await e.apply(this));

    // return the correct response
    if (reser.isDone) return reser.response!;
    else if (!err) return this.createNotFoundResponse();
    else
      return new Response(err, {
        status: 500,
        statusText: 'Internal Server Error',
      });
  }
  /* async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
      //ctx.waitUntil(doSomeTaskOnASchedule());
    }, */
}
