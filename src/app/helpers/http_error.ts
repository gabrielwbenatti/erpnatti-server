import { HttpStatusCode } from "./http_status_code";

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Preserva o stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DuplicatedRecordError extends HttpError {
  constructor(entity: string, field: string) {
    super(
      `${entity} with the same ${field} already exists`,
      HttpStatusCode.CONFLICT
    );
  }
}

export class MissingFieldError extends HttpError {
  constructor(field: string) {
    super(`Field ${field} is missing`, HttpStatusCode.BAD_REQUEST);
  }
}
