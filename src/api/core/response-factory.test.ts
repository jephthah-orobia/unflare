import { describe, it, expect } from 'vitest';
import { ResponseFactory } from './response-factory';
import { serialize } from 'cookie';

describe('ResponseFactory', () => {
  describe('(Constructor)', () => {
    it('Test Construction', () => {
      const res = new ResponseFactory('example.com');
      expect(res).toBeDefined();
      expect(res).toHaveProperty('send');
      expect(res).toHaveProperty('response');
      expect(res).toHaveProperty('isDone');
      expect(res).toHaveProperty('json');
      expect(res).toHaveProperty('status');
    });
  });

  describe('.response', () => {
    it('should return a newly created response object everytime', async () => {
      const res = new ResponseFactory('hello.com');
      res.send('Some info');
      const res1 = res.response;
      const res2 = res.response;
      expect(res1).toBeInstanceOf(Response);
      expect(await res1!.text()).toBe('Some info');
      expect(res2).toBeInstanceOf(Response);
      expect(await res2!.text()).toBe('Some info');
      expect(res1).not.toBe(res2);
    });
  });

  describe('.status()', () => {
    it('should set the status code and status text of the response', () => {
      const res = new ResponseFactory('example.com');
      res.status(205, 'Testing');
      res.send();
      const response = res.response;
      expect(response).not.toBeNull();
      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(205);
      expect(response!.statusText).toBe('Testing');
    });
    it('should should be chainable', () => {
      const res = new ResponseFactory('example.com');
      expect(res.status(205)).toStrictEqual(res);
      res.status(305).send();
      const response = res.response;
      expect(response).not.toBeNull();
      expect(response!.status).not.toBe(205);
      expect(response!.status).toBe(305);
    });
  });

  describe('.send()', () => {
    it('should set .isDone to true', async () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.send();
      expect(res.isDone).toBe(true);
    });

    it('should set the body of the returned response to the input', async () => {
      const resp = new ResponseFactory('example.com');
      const toSend = 'Hello Abc123';
      resp.send(toSend);
      expect(resp.isDone).toBe(true);
      const res = resp.response;
      expect(await res!.text()).toBe(toSend);

      const resp1 = new ResponseFactory('json.com');
      const toSend1 = { user: 'tester', id: '12412312' };
      resp1.send(JSON.stringify(toSend1));
      const res1 = resp1.response;
      expect(await res1!.text()).toBe(JSON.stringify(toSend1));
    });
  });

  describe('.json()', () => {
    it('should call .send', async () => {
      const res = new ResponseFactory('example.com');
      const tosend = { user: 'tester', id: '12412312' };
      expect(res.isDone).toBe(false);
      res.json(tosend);
      expect(res.isDone).toBe(true);
    });
    it('should set the header to the appropriate content-type for json', async () => {
      const res = new ResponseFactory('example.com');
      const tosend = { user: 'keeser', id: '12412312' };
      res.json(tosend);
      const resp = res.response;
      const contentType = resp!.headers.get('Content-Type');
      expect(contentType).not.toBeNull();
      expect(contentType).toBe('application/json; charset=UTF-8');
    });
  });

  describe('.html()', () => {
    it('should call .send', async () => {
      const res = new ResponseFactory('example.com');
      const tosend = `
        <html>
          <body> Some Contetnt </body>
        </html>
      `;
      expect(res.isDone).toBe(false);
      res.html(tosend);
      expect(res.isDone).toBe(true);
    });
    it('should set the header to the appropriate content-type for json', async () => {
      const res = new ResponseFactory('example.com');
      const tosend = `
        <html>
          <body> Some Contetnt </body>
        </html>
      `;
      res.html(tosend);
      const resp = res.response;
      const contentType = resp!.headers.get('Content-Type');
      expect(contentType).not.toBeNull();
      expect(contentType).toBe('text/html; charset=UTF-8');
    });
  });

  describe('.cookie()', () => {
    it('should set the header Set-Cookie', () => {
      const res = new ResponseFactory('example.com');
      const toset = { user: 'tester', id: '12412312' };
      const serializedCookie = serialize('user', JSON.stringify(toset));
      res.cookie('user', JSON.stringify(toset));
      res.headers.set('Location', '/');
      res.status(302).send();
      const resp = res.response;
      expect(resp!.headers.get('Set-Cookie')).toBe(serializedCookie);
    });
    it('should merge all cookies in a single Set-Cookie header', () => {
      const res = new ResponseFactory('example.com');
      const toset = { user: 'tester', id: '12412312' };
      const toset1 = { user: 'tester1', id: '12412313' };
      const toset2 = { user: 'tester2', id: '12412314' };
      const serializedCookie = serialize('user', JSON.stringify(toset));
      const serializedCookie1 = serialize('user1', JSON.stringify(toset1));
      const serializedCookie2 = serialize('user2', JSON.stringify(toset2));
      res.cookie('user', JSON.stringify(toset));
      res.cookie('user1', JSON.stringify(toset1));
      res.cookie('user2', JSON.stringify(toset2));
      res.headers.set('Location', '/');
      res.status(302).send();
      const resp = res.response;
      expect(resp!.headers.get('Set-Cookie')).toBe(
        serializedCookie + ',' + serializedCookie1 + ',' + serializedCookie2
      );
    });
  });

  describe('.header()', () => {
    it('should set the header', () => {
      const res = new ResponseFactory('example.com');
      res.header('user', 'someone').header('that', 'this');
      res.send();
      const resp = res.response;
      expect(resp!.headers.get('user')).toBe('someone');
      expect(resp!.headers.get('that')).toBe('this');
    });
    it('should not be able to set headers when the res is done.', () => {
      const res = new ResponseFactory('example.com');
      res.send();
      res.header('user', 'someone').header('that', 'this');
      const resp = res.response;
      expect(resp!.headers.get('user')).toBeNull();
      expect(resp!.headers.get('that')).toBeNull();
    });
  });

  describe('.end()', () => {
    it('should set .isDone to true', () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.end();
      expect(res.isDone).toBe(true);
    });
  });

  describe('.write()', () => {
    it('should append content of the body', () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.write('Welcome to');
      expect(res.body).toBe('Welcome to');
      res.write(' unflare Page');
      expect(res.body).toBe('Welcome to unflare Page');
    });
    it('should not do anything to .body when .send or .end or the likes are called', () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.write('Welcome to');
      expect(res.body).toBe('Welcome to');
      res.end();
      res.write(' unflare Page');
      expect(res.body).toBe('Welcome to');
    });
  });

  describe('.writeLine()', () => {
    it('should append a new line to the content of the body', () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.writeLine('Welcome to');
      expect(res.body).toBe('Welcome to\n');
      res.writeLine(' unflare Page');
      expect(res.body).toBe('Welcome to\n unflare Page\n');
    });
    it('should not do anything to .body when .send or .end or the likes are called', () => {
      const res = new ResponseFactory('example.com');
      expect(res.isDone).toBe(false);
      res.writeLine('Welcome to');
      expect(res.body).toBe('Welcome to\n');
      res.end();
      expect(res.body).toBe('Welcome to\n');
    });
  });
});
