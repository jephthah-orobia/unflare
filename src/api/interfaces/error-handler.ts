import { Requester } from '../core/requester';
import { ResponseFactory } from '../core/response-factory';
import { NextFunction } from './middleware';

export type ErrorHandler = (
  err: any,
  req: Requester,
  res: ResponseFactory,
  next: NextFunction
) => void | Promise<void>;

export const isErrorHandler = (obj: any): obj is ErrorHandler => {
  return obj.constructor.name === 'Function' && obj.length == 4;
};
