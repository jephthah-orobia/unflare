# unflare

Just another [express](https://expressjs.com/)-inspired web framework for [cloudflare's workers](https://workers.cloudflare.com/).

![npm bundle size](https://img.shields.io/bundlephobia/min/unflare?label=install%20size&style=plastic) ![npm version](https://img.shields.io/npm/v/unflare?style=plastic) ![node-current](https://img.shields.io/node/v/unflare)

```typescript
import { Unflare, Requester, Responder } from 'unflare';

const app = new Unflare();

app.get('/', function (req: Requester, res: Responder) {
  res.send('Hello World!');
});

export default app;
```

## Installation

Requires at least [Node v18](https://nodejs.org/en/), but preferably [Node v19](https://nodejs.org/en/) or latest.

This module is intended to be use for [cloudflare's workers](https://workers.cloudflare.com/) to help manage routing and handling of request. To avoid issues, install this after [creating your wrangler/workers project](https://developers.cloudflare.com/workers/get-started/guide).

Installation is done using the `npm install` command:

```
$ npm install unflare
```

## Features

- specifically for [cloudflare's workers](https://workers.cloudflare.com/).
- write like you would with [express](https://expressjs.com/).
- treeshakeable and ES6 compliant.
- scoped and recursive handling of middlewares, routers, routes and error handlers.
- auto extraction of queries, params, cookies and body of request.
