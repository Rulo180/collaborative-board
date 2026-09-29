// Base typed error used by middleware to map domain failures into HTTP responses.
export class HttpError extends Error {
  statusCode: number;
  details?: string[];

  constructor(statusCode: number, message: string, details?: string[]) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Specialized 400 error to keep route validation failures explicit.
export class BadRequestError extends HttpError {
  constructor(message: string, details?: string[]) {
    super(400, message, details);
    this.name = 'BadRequestError';
  }
}
