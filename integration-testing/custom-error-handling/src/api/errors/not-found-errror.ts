import { SerializableError } from './serializable-error';

export class NotFoundError extends SerializableError {
  code: number = 404;
  messages: string[] = ['Page Not Found.'];
}
