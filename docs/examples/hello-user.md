# Hello { user }!: A Step-by-Step Guide

This guide will walk you through the process of creating a simple “Hello, {user}!” site using Unflare, leveraging the power of Cloudflare’s worker. You can view the final result of this tutorial [here](https://example-hello-user.unflare.workers.dev/).

## Prerequisites

Before starting this tutorial, it’s important to have a solid understanding of several technologies and skills. Here’s what you need to know:

- **HTML 5**: The standard markup language for creating web pages.
- **CSS**: The style-sheet language used for describing the look and formatting of a document written in HTML.
- **JavaScript**: A high-level, interpreted programming language that conforms to the ECMAScript specification.
- **TypeScript**: An open-source language which builds on JavaScript by adding static type definitions.
- **npm (Node Package Manager)**: An essential tool for any JavaScript developer, used for managing and sharing packages.

Additionally, you should be comfortable with managing npm projects. This includes understanding the structure of `package.json`, installing dependencies, and running scripts.

If you’re new to any of these topics, there are many resources available online where you can learn more about them. Once you’re comfortable with these technologies, you’ll be able to get the most out of this tutorial.

## Getting Started

Before we dive in, make sure to familiarize yourself with how to initialize your serverless project. You can find more information about this [here](https://developers.cloudflare.com/workers/get-started/guide/).

> _Note: We recommend choosing `TypeScript` for this tutorial._

## Tutorial Overview

In this tutorial, you will:

1. Set up your development environment.
2. Understand the concept of routing requests.
3. Learn how to acquire necessary assets (i.e., `req` and `res`) via object destructuring.
4. Understand `req` as a `RequestInspector` and `res` as a `ResponseFactory`.
5. Retrieve information by users when they submit a form.
6. Learn how to set cookies.
7. Deploy your “Hello, {user}!” site.

By the end of this tutorial, you will have a fully functioning site that greets the user with a friendly “Hello, {user}!”. This tutorial is designed to be similar to developing on a Node Express app, making it a comfortable transition for those familiar with that environment. We look forward to seeing what you create!

## Setting Up Unflare:

After creating your serverless project, you can install Unflare with the following command:

```
$ npm -i unflare
```

## Configuring Unflare

Once installed, you’ll need to configure Unflare in your project. Start by locating the `index.ts` or `index.js` file and deleting all its content. Then, import the Unflare module and create a new instance of it in a constant variable like this:

```typescript
import { Unflare } from 'unflare';

const app = new Unflare();
```

Alternatively, you can import and instantiate Unflare in this way:

```typescript
import unflare from 'unflare';

const app = new unflare();
```

The Unflare instance has a public method `fetch()`, which is what [workers](https://workers.cloudflare.com/) look for when handling requests. Therefore, at the end of the file, expose the variable that holds the instance of Unflare (in this example, `app`) as the default export like so:

```typescript
export default app;
```

This will ensure that your application is properly set up to handle requests using Unflare.

## Defining Routes

Similar to [express](https://expressjs.com/), you can associate handlers with paths by using the `.method(path, handler)` on the instance of unflare, where _method_ is the accepted [HTTP verb](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) for the path. For example:

```typescript
app.get('/a-page', () => {
  //handle request here
});
```

In this case, the accepted _method_ is `'GET'` and the _path_ is `'/a-page'`. The arrow function is the _handler_. Unlike in [Unflare v1](https://github.com/jephthah-orobia/unflare/tree/v1), where the developer was trying to mimick [express](https://expressjs.com/) as is, handlers don't need parameters.

> _Important note: Make sure to add the route before exposing `app` as the default export._

Now, let's add our landing page for our site by adding the root path `'/'` with a methtod of `GET`. Your file should now look like this:

```typescript
import { Unflare } from 'unflare';

const app = new Unflare();

app.get('/', () => {
  const { res } = app; // acquire ResponseFactory

  res.send('Hello World!');
});

export default app;
```

You can test it out locally by running the following command:

```
$ > npm run start
```

> We suggest adding `-l` flag to your `start` script in npm's `package.json` so that it will only run on your local machine.

Click one of the links given by wrangler to checkout your work. If you see "Hello World!" on your browser, then everything is working great. Now it's time to publish it to Workers with the following command:

```
$ > wrangler publish .
```

> Important! Make sure its `wrangler publish` and NOT `npm publish`. If you made this mistake, npm will try to publish your work as a package.

> If this is your first time publishing something to workers, you will be prompted to login.

Now open your browser and visit the site of your workers, for this tutorial the project was named `example-hello-user`, hence the site was [https://example-hello-user.unflare.workers.dev/](https://example-hello-user.unflare.workers.dev/). Click the link to checkout what will be the final output for this tutorial.

## Organizing Routes and Routers

In the context of a simple application, the amount of code required might be minimal. However, as your application grows in complexity, it’s likely that the number of routes and the corresponding code will increase significantly. To maintain a clean and manageable codebase, we recommend a modular approach to route handling in Unflare. This involves creating separate files for each route and grouping related routes using a router.

Here are some of the routes we'll be working with:

- <strong>`GET: /`</strong> - This serves as the landing page.
- <strong>`POST: /sign-in`</strong> - This route is responsible for user authentication.
- <strong>`GET: /sign-out`</strong> - This route handles user sign-out.

While these routes could technically be consolidated into a single file, we will distribute them across multiple files to demonstrate the benefits of a modular approach. Specifically, we will create a separate route for the landing page and a router to handle both sign-in and sign-out operations. This strategy not only enhances code readability but also facilitates future code analysis and debugging.

Next, we’ll create a directory named `handlers`. Within this directory, we’ll add two files: `home.ts` and `signing.ts`. Your project directory should now look like this:

```
📂 your-project-folder
├── 📂 node_modules
├── 📂 src
|   ├── 📂 handlers
│   |    ├── 📄 home.ts
│   |    └── 📄 signing.ts
|   └── index.ts
└── 📄 other files...
```

This structure helps to keep our route handlers organized and easily accessible. Each file corresponds to a specific route or set of routes, promoting a clean and modular codebase.

### Setting Up the Landing Page

Open `home.ts` and import `Route`. Create an instance of it and export it as shown:

```typescript
import { Route } from 'unflare';

export const HomeRoute = new Route('/');
```

Instantiating a `Route` in Unflare requires a string or regex that defines the paths that it will handle. In this case, it will be the landing page so we pass `'/'` to it.

Now this doesn't do anything yet as only the path is defined. We have to explicitly define how each method or HTTP verb will be handled. The default method used by browsers when visiting web pages, especially landing pages, is `GET`.

```typescript
HomeRoute.get('/', () => {
  // show landing page.
});
```

The landing page should respond depending on whether it knows the user, sort of like if the user is logged in. We can do this by checking the request's cookies if there is a `user` set.

```typescript
HomeRoute.get('/', () => {
  const { req } = HomeRoute; // acquire RequestInspector
  if (!req.cookies.user) {
    // there is no user, so let the user know we don't know them.
  } else {
    // there is a user, give a greeting.
  }
});
```

Observe how we acquire the cookies. First, we get the `RequestInsppector` by taking advantage of [ES6's Object Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). In Unflare, instances of `Unflare`, `Route` and `Router` have the following assets that you can acquire as you need:

- `env` or `ENV` - this is the enviroment namespace.
- `req` - this is the `RequestInspector` responsible for containing information regarding the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request).
- `res` - this is the `ResponseFactory` that you can use to describe the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) to the user.
- `body`, `params`, `query` - this objects contains `key=value` pairs sent by the user.
- `cookies`, `headers` - taken from from `req` so that you can exclusively only get them if they are the only ones you need.
- `data` - this is set in `req` and can be used to pass information to the next set of handlers.

In the case with our code, we actually only needed the cookies so we can instead acquire `cookies` rather than `req`. Let us also acquire `res` as we will need it later to describe our landing page.

```typescript
HomeRoute.get('/', () => {
  const { cookies, res } = HomeRoute;
  if (!cookies.user) {
    // there is no user, so let the user know we don't know them.
    res.send("I don't know you");
  } else {
    // there is a user, give a greeting.
    res.send('I know you!');
  }
});
```

`res.send()` will send a response with a content-type of plain text. We will use `res.html()`. Just copy the html code below and insert it in `res.html()` for the response when cookies.user is not set:

> use the tilde char ( ` ) to define multi-line strings

```html
<!DOCTYPE html>
<html>
  <head>
    <title>I don't know you!</title>
  </head>
  <body
    style="
    background-color: #333333;
    ">
    <div
      style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>I don't know you!</h1>
      <form
        action="/sign-in"
        method="POST">
        <p><label for="name">What is your name?</label></p>
        <p>
          <input
            type="text"
            id="name"
            name="name" />
        </p>
        <p><input type="submit" /></p>
      </form>
    </div>
  </body>
</html>
```

and this one for when cookies.user is set:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello ${user.name}!</title>
  </head>
  <body
    style="
    background-color: #333333;
    ">
    <div
      style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>Hello ${user.name}!</h1>
      <p>You are also known as:</p>
      <h3>user#${user.id}</h3>
      <form
        action="/sign-out"
        method="GET">
        <p>
          <input
            type="submit"
            value="I'm someone else!" />
        </p>
      </form>
    </div>
  </body>
</html>
```

The great thing about using tilde for multi-line strings is that you can use templates. Your code in `home.ts` should now look like this:

```typescript
import { Route } from 'unflare';

export const HomeRoute = new Route('/');

HomeRoute.get(() => {
  const { cookies, res } = HomeRoute;
  if (!cookies.user) {
    return res.html(`
<!DOCTYPE html>
<html>
  <head>
    <title>I don't know you! </title>
  </head>
  <body style="
    background-color: #333333;
    ">
    <div style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>I don't know you!</h1>
      <form action="/sign-in" method="POST">
        <p><label for="name">What is your name?</label></p>
        <p><input type="text" id="name" name="name" /></p>
        <p><input type="submit" /></p>
      </form>
    </div>
  </body>
</html>
      `);
  } else {
    const user = JSON.parse(cookies.user);
    return res.html(`
<!DOCTYPE html>
<html>
  <head>
    <title>Hello ${user.name}! </title>
  </head>
  <body style="
    background-color: #333333;
    ">
    <div style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>Hello ${user.name}! </h1>
      <p> You are also known as:</p>
      <h3>user#${user.id}</h3>
      <form action="/sign-out" method="GET">
        <p><input type="submit" value="I'm someone else!" /></p>
      </form>
    </div>
  </body>
</html>`);
  }
});
```

> `return` statement isn't really needed here but make it a habit to call `return` when you want your function to end to avoid running codes after that point.

### Configuring Cookies

As discussed in the previous section, we'll utilize cookies to identify the user. Begin by opening `signing.ts`, importimg `Router` from `unflare`, and defining an instance of it as a constant `router`.

```typescript
import { Router } from 'unflare';

const router = new Router();
```

Contrary to `Route`, `Router` doesn't need an argument to instantiate. A `Router` is essentially a collection of `Route` or `Routers`, its primary function is to group related handlers together. In this instance, we're grouping `sign-in` and `sign-out` into a single router. Creating routes within a router is identical to doing so with an `Unflare` instance. Let's proceed with creating the remaining routes:

```typescript
router.post('/sign-in', () => {
  //this will handle signing-in
});

router.get('/sign-out', () => {
  //this will handle signing-out
});
```

#### Understanding `query` vs `body` vs `params`

When a user submits a form, if it's via GET, it will be stored in `query`. If it's via POST, it will be placed in the body, hence we can access it on `body`. `params`, on the other hand, are information obtained from the path. For more information on `params`, please refer to this [link](../api/params.md).

Let's retrieve `body` since the user data is passed via POST and let us also acquire `res`. If `body.name` is undefined, it indicates a client error, so we should set the status code to `400` and display a web page. Otherwise, create an random id and bundle it with the `body.name` to form a JSON object that we will stringify and set as the value for the `user` cookie as shown:

```typescript
router.get('/sign-in', () => {
  const { body, res } = router;
  if (!body.name)
    return res.status(400).html(`
<!DOCTYPE html>
<html>
  <head>
    <title>I did not hear you say your name.</title>
  </head>
  <body style="
    background-color: #333333;
    ">
    <div style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>I did not hear you say your name.</h1>
      <h2>Let's try it again in <span style="color: red" id="counter">3</span> seconds.</h2>
      <h3>If you're in a hurry or this doesn't automatically redirects, <a href="/">click here</a></h3>
    </div>
    <script>
      window.onload = ()=>{
        let counter = 2;
        const countdownElement = document.getElementById('counter');

        const countdown = setInterval(() => {
          countdownElement.textContent = counter;
          counter--;
          
          if (counter < 0) {
            clearInterval(countdown);
            window.location.href = '/';
          }
        }, 1000);
      }
    </script>
  </body>
</html>`);
  const id = crypto.randomUUID();
  res.cookie('user', JSON.stringify({ name: body.name, id }));
  res.status(302, 'Redirecting').headers.set('Location', '/');
  return res.send();
});
```

We set cookies by calling `cookie(name, value)` method of `res`. We can easily set the status code by calling `status` method on `res`. It is chainable so after setting the status code, you can immediately perform another action. In the code above, we use status code 302 to redirect the request.

Now handling `/sign-out` is quite straightforward. Simply set the cookies' `user` to an empty string then redirect as shown:

```typescript
router.get('/sign-out', () => {
  const { res } = router;
  res.cookie('user', '');
  res.status(302, 'Redirecting').headers.set('Location', '/');
  return res.send();
});
```

Our `router` is not yet exported. Export the `router` with the name `SingingRouter` at the very bottom of the file:

```typescript
export { router as SigningRouter };
```

This concludes your revised version of `signing.ts`. Your final code int the file should look like this:

```typescript
import { Router } from 'unflare';

const router = new Router();

router.post('/sign-in', () => {
  const { body, res } = router;
  if (!body.name)
    return res.status(400).html(`<!DOCTYPE html>
<html>
  <head>
    <title>I did not hear you say your name.</title>
  </head>
  <body style="
    background-color: #333333;
    ">
    <div style="
      background-color: rgba(240, 240, 240, 0.8);
      width: 400px;
      padding: 30px 20px;
      border-radius: 20px;
      margin: 50px auto;
      text-align: center;
    ">
      <h1>I did not hear you say your name.</h1>
      <h2>Let's try it again in <span style="color: red" id="counter">3</span> seconds.</h2>
      <h3>If you're in a hurry or this doesn't automatically redirects, <a href="/">click here</a></h3>
    </div>
    <script>
      window.onload = ()=>{
        let counter = 2;
        const countdownElement = document.getElementById('counter');

        const countdown = setInterval(() => {
          countdownElement.textContent = counter;
          counter--;
          
          if (counter < 0) {
            clearInterval(countdown);
            window.location.href = '/';
          }
        }, 1000);
      }
    </script>
  </body>
</html>
`);
  const id = crypto.randomUUID();
  res.cookie('user', JSON.stringify({ name: body.name, id }));
  res.status(302, 'Redirecting').headers.set('Location', '/');
  return res.send();
});

router.get('/sign-out', () => {
  const { res } = router;
  res.cookie('user', '');
  res.status(302, 'Redirecting').headers.set('Location', '/');
  return res.send();
});

export { router as SigningRouter };
```

## Conclusion

Now, return to `index.ts`, import `{ HomeRoute }` from `./handlers/home` and `{ SigningRouter }` from `./handlers/signing`. We will utilize the method `.use()` of Unflare instance to incorporatet the routes and routers (this method is also beneficial for integrating middlewares and error handlers):

```typescript
import { Unflare } from 'unflare';
import { HomeRoute } from './handlers/home';
import { SigningRouter } from './handlers/signing';

const app = new Unflare();

app.use(HomeRoute, SigningRouter);

export default app;
```

To test your project, run the npm command:

```
$ > npm start
```

Your project should function [this](https://example-hello-user.unflare.workers.dev/).

Finally, publish your work on Workers:

```
$ > wangler publish .
```

or

```
$ > npx wrangler deploy
```

Congratulations on completing your project! If you have any other questions or need further assistance, feel free to ask. Happy coding! 😊
