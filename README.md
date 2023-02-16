# unflare

Minimal Web framework for [cloudflare's workers](https://workers.cloudflare.com/).

```typescript
import unflare from 'unflare';

const app = unflare();

app.get('/', function (req, res) {
  res.send('Hello World');
});

export default { fetch: app.fetch };
```
