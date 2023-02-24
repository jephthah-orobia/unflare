# unflare

Just another [express](https://expressjs.com/)-inspired web framework for [cloudflare's workers](https://workers.cloudflare.com/).

## Examples

### ES6:

```js
import unflare from 'unflare';

export const app = new unflare();

app.get('/', function (req, res) {
  res.send('Hello World');
});

export default app;
```

### Typescript:

```typescript
import { Unflare, Requester, Responder } from 'unflare';

export const app = new Unflare();

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
