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

  static Router(): Router {
    return new Router();
  }

  listen(mod: NodeModule) {
    mod.exports.default = this;
  }

  async fetch(
    req: Request,
    env?: Env,
    ctx?: ExecutionContext
  ): Promise<Response> {
    ctx?.passThroughOnException();
    const reqer = await Requester.fromRequest(req, this.strict);
    const reser = new Responder(reqer.url.host);
    try {
      await this.handle(reqer, reser);
    } catch (err: any) {
      this.handleError(err, reqer, reser);
    }
    if (reser.isDone) return reser.response!;
    else
      return new Response('Internal Server Error', {
        status: 500,
        statusText: 'Server Error',
      });
  }
  /* async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //ctx.waitUntil(doSomeTaskOnASchedule());
  }, */
}
