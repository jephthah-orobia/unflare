import { Requester } from './requester';
import { Responder } from './responder';
import { Router, RouteHandlers } from './router';

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export interface UnflareOptions {
  strictRouting?: boolean; //default: false
}

export class Unflare extends Router {
  strict: boolean = false;
  constructor(
    // in preparation of additional options in the future
    options: UnflareOptions = {
      strictRouting: false,
    }
  ) {
    super();
    if (options.strictRouting) this.strict = true;
  }

  static Router(): Router {
    return new Router();
  }

  listen(mod: NodeModule) {
    mod.exports = this;
  }

  async fetch(
    req: Request,
    env?: Env,
    ctx?: ExecutionContext
  ): Promise<Response> {
    ctx?.passThroughOnException();
    const reqer = new Requester(req, this.strict);
    const reser = new Responder(reqer.url.host);
    if (this.canHandle(reqer)) {
      await this.handle(reqer, reser);
      if (reser.isDone) return reser.response!;
      else await this.handle(reqer, reser, new Error('Route Not Found Error'));
      if (reser.isDone) return reser.response!;
      else
        return new Response('Internal Server Error', {
          status: 500,
          statusText: 'Server Error',
        });
    } else {
      return new Response('Page not found!', {
        status: 404,
        statusText: 'Not Found',
      });
    }
  }
  /* async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //ctx.waitUntil(doSomeTaskOnASchedule());
  }, */
}

export declare interface Unflare {
  head(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  get(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  post(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  put(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  patch(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  delete(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  connect(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  trace(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  options(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;
  all(
    path: string | RegExp,
    ...args: (RouteHandlers | RouteHandlers[])[]
  ): Router;

  [index: string]: any;
}
