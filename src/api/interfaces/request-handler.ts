import { Requester } from '../core/requester';
import { Responder } from '../core/responder';

export interface RequestHandler {
  canHandle(req: Requester): boolean;
  handle(req: Requester, res: Responder, err?: any): Promise<void>;
}

export const isRequestHandler = (obj: any): obj is RequestHandler => {
  const keys = Object.keys(obj);
  return keys.includes('canHandle') && keys.includes('handle');
};
