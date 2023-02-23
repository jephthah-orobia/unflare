```
title: ReadMe
output: html_document
```

# unflare

Just another [express](https://expressjs.com/)-inspired web framework for [cloudflare's workers](https://workers.cloudflare.com/).

## Examples {.tabset}

### Typescript:

```typescript
import unflare, { Requester, Responder } from 'unflare';

const app = unflare();

app.get('/', function (req: Requester, res: Responder) {
  res.send('Hello World');
});

app.listen(module);
```

### Javascript ES6:

```js
import unflare from 'unflare';

const app = unflare();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(module);
```

## Installation

This module is intended to be use for [cloudflare's workers](https://workers.cloudflare.com/) to help manage routing and handling of request.

Installation is done unsing the `npm install` command:

```
$ npm install unflare
```
