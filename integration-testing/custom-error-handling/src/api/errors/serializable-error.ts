export abstract class SerializableError {
  abstract code: number;
  abstract messages: string[];
  serialize(): string {
    return JSON.stringify({ errors: this.messages });
  }
}
