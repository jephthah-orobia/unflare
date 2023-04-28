# Why not be like express?

Starting v2, the developer stopped trying to mimick express syntax. Why? This document will discuss the reasons.

## Reason #1: shorter syntax.

This is v1 syntax:

```typescript
// v1
import { Unflare, Requester, Responder } from 'unflare';

const app = new Unflare();

app.get('/', (req: Requester, res: Responder) => {
  res.send('Hello World!');
});

export default app;
```

This is v2 syntax

```typescript
import { Unflare } from 'unflare';

const app = new Unflare();

app.get('/', () => {
  const { res } = app;
  res.send('Hello World!');
});

export default app;
```

The hassle in v1 may not be obvious if your doing pure js, however, if you are using `typescript` (who wouldn't?), the task of repeating `(req: Requester, res: Responder)` for every route/handler/middleware is a hassle, also add more file size.

## Reason #2: Optimize

Unlike in previous version where you will always need to declare req and res on params, in v2, declare only what you need by taking advantage of JS object destructuring. Take for example the code below:

```typescript
app.get('/', () => {
  const { res } = app;
  res.send('Hello World!');
});

app.post('/signin', () => {
  const { body, res } = app;
  // body contains data sent on post
  // do something with data in body
  res.send('Data recieved');
});

app.get('/need-header', () => {
  const { req, res } = app;
  res.send('I got your headers via req');
});
```
