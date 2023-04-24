import { Unflare } from 'unflare';
import { AnotherError } from './api/errors/another-error';
import { NotFoundError } from './api/errors/not-found-errror';
import { CustomErrorHandler } from './error-handlers/custom-error-handler';

export interface Env {} // needed by wrangler

const app = new Unflare();

app.use(CustomErrorHandler);

app.get('/', () => {
  const { res } = app;
  res.send('Hello World');
});

app.get('/path-that-throws-error', () => {
  throw new AnotherError('An error is thrown!');
});

app.all('*', () => {
  console.log('code is reached');
  throw new NotFoundError();
});

export default app;
