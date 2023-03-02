import { Requester, Responder, NextFunction } from '../../../../dist';
import { SerializableError } from '../api/errors/serializable-error';

export const CustomErrorHandler = (
  err: any,
  req: Requester,
  res: Responder,
  next: NextFunction
) => {
  if (!err) {
    console.error('no error defined');
    res.send('Error handler called, but no error is given');
    return;
  }
  if (err instanceof SerializableError)
    res.status(err.code).send(err.serialize + 'by custom');
};
