/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}
import { Unflare, Requester, Responder } from 'unflare';

export const app = new Unflare();

app.get('/', function (req: Requester, res: Responder) {
  res.headers.set('Content-Type', 'text/html');
  if (!req.cookies.user) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title> You are not logged in! </title>
        </head>
        <body>
          <h1> Sign In</h1>
          <form action="/users" method="POST">
            <input type="text" name="name" />
            <input type="submit" />
          </form>
        </body>
      </html>
    `);
  } else {
    const user = JSON.parse(req.cookies.user);
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title> You are logged in! </title>
        </head>
        <body>
          <h1> Welcome ${user.name}</h1>
          <form action="/signout" method="GET">
            <input type="submit" value="Sign Out" />
          </form>
        </body>
      </html>
    `);
  }
});

app.post('/users', function (req: Requester, res: Responder) {
  if (!req.body.name) return res.status(401).send('name');
  const id = crypto.randomUUID();
  res.cookie('user', JSON.stringify({ name: req.body.name, id }));
  res.status(302, 'Redirecting').headers.set('Location', '/');
  res.send();
});

app.get('/signout', (req: Requester, res: Responder) => {
  res.cookie('user', '');
  res.status(302, 'Reedirecting').headers.set('Location', '/');
  res.send();
});

export default app;
