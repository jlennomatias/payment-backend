export class NotFoundError extends Error {
  constructor(
    public code: string,
    public title: string,
    public detail: string,
  ) {
    super(`[${code}] ${title}: ${detail}`)
    this.name = 'NotFoundError'
  }
}

export class UnprocessableEntityError extends Error {
  constructor(
    public code: string,
    public title: string,
    public detail: string,
  ) {
    super(`[${code}] ${title}: ${detail}`)
    this.name = 'UnprocessableEntityError'
  }
}

export class DefaultError extends Error {
  constructor(
    public errors: any[],
    public meta: any,
  ) {
    super(`${errors} ${meta}`)
    this.name = 'DefaultError'
  }
}
