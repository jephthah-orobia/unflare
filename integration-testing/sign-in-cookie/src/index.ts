import { Unflare } from 'unflare';

export interface Env {} // needed by wrangler

export const app = new Unflare();

app.get('/', () => {
  const { req, res } = app;
  if (!req.cookies.user) {
    return res.html(`
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
    return res.html(`
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

app.post('/users', () => {
  const { req, res } = app;
  if (!req.body.name) return res.status(401).send('name');
  const id = crypto.randomUUID();
  res.cookie('user', JSON.stringify({ name: req.body.name, id }));
  res.status(302, 'Redirecting').headers.set('Location', '/');
  res.send();
});

app.get('/signout', () => {
  const { res } = app;
  res.cookie('user', '');
  res.status(302, 'Reedirecting').headers.set('Location', '/');
  res.send();
});

export default app;
