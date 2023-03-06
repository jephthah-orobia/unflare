import { SerializableError } from './serializable-error';

export class AnotherError extends SerializableError {
  code: number = 500;
  messages: string[] = [];
  constructor(public message: string) {
    super();
    this.messages.push(message);
  }
}
