import { Unflare, Requester, Responder } from 'unflare';
import { AnotherError } from './api/errors/another-error';
import { NotFoundError } from './api/errors/not-found-errror';
import { CustomErrorHandler } from './error-handlers/custom-error-handler';

export interface Env {} // needed by wrangler

const app = new Unflare();

app.use(CustomErrorHandler);

app.get('/', (req: Requester, res: Responder) => {
  res.send('Hello World');
});

app.get('/path-that-throws-error', (req: Requester, res: Responder) => {
  throw new AnotherError('An error is thrown!');
});

app.all('*', (req: Requester, res: Responder) => {
  console.log('code is reached');
  throw new NotFoundError();
});

export default app;
