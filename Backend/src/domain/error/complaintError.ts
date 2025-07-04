export class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFoundError';
    }
  }
  
  export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  export class AuthorizationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthorizationError';
    }
  }
  
  export class DuplicateResourceError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DuplicateResourceError';
    }
  }
  
  export class ServerError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ServerError';
    }
  }