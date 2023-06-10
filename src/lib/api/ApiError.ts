export class ApiError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * Unauthorized
 * 401
 */
export function unauthorized(message = 'Unauthorized') {
  return new ApiError(401, message);
}

/**
 * Not Found
 * 404
 */
export function notFound(message = 'Not Found') {
  return new ApiError(404, message);
}

/**
 * Forbidden
 * 403
 */
export function forbidden(message = 'Forbidden') {
  return new ApiError(403, message);
}

/**
 * Bad Request
 * 400
 */
export function badRequest(message = 'Bad Request') {
  return new ApiError(400, message);
}

/**
 * Conflict
 * 409
 */
export function conflict(message = 'Conflict') {
  return new ApiError(409, message);
}

/**
 * Internal Server Error
 * 500
 */
export function internalServerError(message = 'Internal Server Error') {
  return new ApiError(500, message);
}
