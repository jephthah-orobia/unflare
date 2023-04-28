# Hello { user }!

This example uses cloudflare's worker. Read more about initializing your serverless project [here](https://developers.cloudflare.com/workers/get-started/guide/).

## Install Unflare v2:

After creating your serverless project, install Unflare.

```
$ npm -i unflare
```

## Expose Unflare

Look for the file `index.ts` or `index.js` and delete all it's content. Inside the file,
import unflare module and create a new instance of it in a const variable like this way:

```typescript
import { Unflare } from 'unflare';

const app = new Unflare();
```

or this way:

```typescript
import unflare from 'unflare';

const app = new unflare();
```

The unflare instance have a public method `fetch()` which is what [workers](https://workers.cloudflare.com/) is looking for when handling request. Thus, at the end of the file, expose the variable that holds the instance of unflare, in this example `app`, as the default export like so:

```typescript
export default app;
```

## Adding routes

Just like in [express](https://expressjs.com/), you associate handlers with paths by using the `.method(path, handler)` on the instance of unflare, where _method_ is the accepted [http verb](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) of the path. ie:

```typescript
app.get('/a-page', () => {
  //handle request here
});
```

Above, the accepted _method_ is `'GET'` and the _path_ is `'/a-page'` while the arrow function is the _handler_. However, unlike in [Unflare v1](https://github.com/jephthah-orobia/unflare/tree/v1) - where the developer was trying to mimick [express](https://expressjs.com/) as is - handlers don't need parameters.

> **Important note: make sure the route is added before exposing `app` as the default export.**

Now let us add our landing page for our site by adding the root path `'/'` with a methtod of `get`, now the file should look like this:

```typescript
import { Unflare } from 'unflare';

const app = new Unflare();

app.get('/', () => {
  const { res } = app; // acquire ResponseFactory

  res.send('Hello World!');
});

export default app;
```

//TODO: continue the tutorial
