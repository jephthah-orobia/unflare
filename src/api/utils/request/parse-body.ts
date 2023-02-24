import mime from 'mime-types';
import { typeIs } from './type-is';
import queryString from 'node:querystring';

export async function parseBody(req: Request): Promise<any> {
  if (!req.body) return null;

  const lengthStr =
    req.headers.get('Content-Length') || req.headers.get('content-length');

  if (!lengthStr) {
    console.error('Content-Length of header is invalid!');
    return null;
  }
  const length = parseInt(lengthStr);
  if (isNaN(length) || length < 0) {
    console.error('Content-Length of header is invalid');
    return null;
  }

  const reader = req.body.getReader();
  const bodyUInt8: Uint8Array = new Uint8Array(length);

  let index = -1;

  const appendValueToBodyUInt8 = ({
    done,
    value,
  }: ReadableStreamReadResult): void | PromiseLike<void> => {
    if (done) return;
    else for (const val of value) bodyUInt8[++index] = val;
    return reader.read().then(appendValueToBodyUInt8);
  };
  await reader.read().then(appendValueToBodyUInt8);

  const textdecoder = new TextDecoder();
  if (typeIs(req, /^text\//)) return textdecoder.decode(bodyUInt8);

  if (typeIs(req, /application\/json/i))
    return JSON.parse(textdecoder.decode(bodyUInt8));

  if (typeIs(req, /urlencoded/))
    return queryString.decode(textdecoder.decode(bodyUInt8));

  return bodyUInt8;
}
