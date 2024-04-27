export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnprocessableEntityError';
  }
}

export class DefaultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DefaultError';
  }
}
