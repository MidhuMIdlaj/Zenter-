// domain/errors/AppError.ts
export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
  }
  
  export class DuplicateResourceError extends AppError {
    constructor(message: string) {
      super(message, 409);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string) {
      super(message, 404); 
    }
  }
  
  export class ServerError extends AppError {
    constructor(message: string = "Internal server error") {
      super(message, 500); 
    }
  }