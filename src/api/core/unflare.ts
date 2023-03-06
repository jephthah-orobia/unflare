import { Requester } from './requester';
import { Responder } from './responder';
import { Router } from './router';

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

  /**
   * - Set a new `Response` to this to customize 'Not Found Page';
   * - ie: Set to a response with status code `302` to redirect to a static page.
   * - For more information in constructing a response, check worker's docs on [Response](https://developers.cloudflare.com/workers/runtime-apis/response/)
   */
  notFoundResponse: Response = new Response('Page Not Found!', {
    status: 404,
    statusText: 'Page Not Found!',
  });

  static Router(): Router {
    return new Router();
  }

  async fetch(
    req: Request,
    env?: Env,
    ctx?: ExecutionContext
  ): Promise<Response> {
    ctx?.passThroughOnException();
    const reqer = await Requester.fromRequest(req, this.strict);
    const reser = new Responder(reqer.url.host);
    let err: any = false;
    try {
      await this.tryToHandle(reqer, reser);
    } catch (e: any) {
      console.error(e);
      err = e;
    }
    if (reser.isDone) return reser.response!;
    else if (!err) return this.notFoundResponse;
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
