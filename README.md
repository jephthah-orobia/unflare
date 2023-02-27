# unflare

Just another [express](https://expressjs.com/)-inspired web framework for [cloudflare's workers](https://workers.cloudflare.com/).

![npm bundle size](https://img.shields.io/bundlephobia/min/unflare?label=install%20size&style=plastic) ![npm version](https://img.shields.io/npm/v/unflare?style=plastic)

```typescript
import { Unflare, Requester, Responder } from 'unflare';

const app = new Unflare();

app.get('/', function (req: Requester, res: Responder) {
  res.send('Hello World!');
});

export default app;
```

## Installation

This module is intended to be use for [cloudflare's workers](https://workers.cloudflare.com/) to help manage routing and handling of request.

Installation is done unsing the `npm install` command:

```
$ npm install unflare
```

## Features

- specifically for [cloudflare's workers](https://workers.cloudflare.com/).
- write like you would with [express](https://expressjs.com/).
- treeshakeable and ES6 compliant.
- scoped and recursive handling of middlewares, routers, routes and error handlers.
- auto extraction of queries, params, cookies and body of request.
