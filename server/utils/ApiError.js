class ApiError extends Error {
  constructor({ statusCode, message, errors = [] }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // toJSON is used to serialize the class instance/object to the JSON to be able to pass through the internet network.

  // toJSON serializes the class instance into a plain JSON object, making it safe and structured for network transmission (e.g., API responses). Optionally includes the stack trace only in development mode.
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      // Optional: Include stack only in dev mode
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }
}

export default ApiError;
