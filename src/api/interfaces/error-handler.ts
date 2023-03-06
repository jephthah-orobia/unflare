import { Requester } from '../core/requester';
import { Responder } from '../core/responder';
import { NextFunction } from './middleware';

export type ErrorHandler = (
  err: any,
  req: Requester,
  res: Responder,
  next: NextFunction
) => void | Promise<void>;

export const isErrorHandler = (obj: any): obj is ErrorHandler => {
  return obj.constructor.name === 'Function' && obj.length == 4;
};
