import { SerializableError } from '../api/errors/serializable-error';
import app from '../index';

export const CustomErrorHandler = (err: any) => {
  const { res } = app;
  console.log('Custom Error Handler is called!');
  if (!err) {
    console.error('no error defined');
    res.send('Error handler called, but no error is given');
    return;
  }
  if (err instanceof SerializableError)
    res.status(err.code).json(err.serialize());
  else console.error('err could not be handled');
};
