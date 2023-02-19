import { describe, it, expect } from 'vitest';
import { Responder } from './responder';

describe('Responder test', () => {
  it('Test Construction', () => {
    const res = new Responder('example.com');

    expect(res).toBeDefined();
    expect(res.status(205)).toStrictEqual(res);
  });

  it('should have a property .response that generates a Response', () => {
    const res = new Responder('example.com');
    res.json({});
    expect(res.response).toBeInstanceOf(Response);
  });

  it('Test status()', () => {
    const res = new Responder('example.com');
    expect(res.status(205)).toStrictEqual(res);
    res.send();
    expect(res.response).toBeInstanceOf(Response);
    expect(res.response?.status).toBe(205);
  });

  it('Test send() and response', async () => {
    const res = new Responder('example.com');
    const tosend = 'Hello World';
    res.status(201).send(tosend);
    const response = res.response;
    expect(response).toBeInstanceOf(Response);
    const text = await response?.text();
    expect(text).toBe(tosend);
    expect(response?.status).toBe(201);
  });

  it('Test json() and response', async () => {
    const res = new Responder('example.com');
    const tosend = { user: 'keeser', id: '12412312' };
    res.status(201).json(tosend);
    const response = res.response;
    expect(response).toBeInstanceOf(Response);
    const text = await response?.json();
    expect(text).toStrictEqual(tosend);
    expect(response?.status).toBe(201);
    expect(response?.headers.get('Content-Type')).toStrictEqual(
      'application/json'
    );
  });
});
