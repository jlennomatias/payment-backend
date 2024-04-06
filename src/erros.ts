export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NotEqualError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotEqualError';
  }
}

export class DefaultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DefaultError';
  }
}
