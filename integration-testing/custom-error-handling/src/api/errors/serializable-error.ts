export abstract class SerializableError {
  abstract code: number;
  abstract messages: string[];
  serialize() {
    return { errors: this.messages };
  }
}
