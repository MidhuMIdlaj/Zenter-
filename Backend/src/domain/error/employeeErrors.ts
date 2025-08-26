import { StatusCode } from "../../shared/enums/statusCode";

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
      super(message, StatusCode.BAD_REQUEST);
    }
  }
  
  export class DuplicateResourceError extends AppError {
    constructor(message: string) {
      super(message, 409);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string) {
      super(message, StatusCode.NOT_FOUND); 
    }
  }
  
  export class ServerError extends AppError {
    constructor(message: string = "Internal server error") {
      super(message, StatusCode.INTERNAL_SERVER_ERROR); 
    }
  }