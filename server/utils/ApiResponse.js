class ApiResponse {
  constructor({ statusCode, message, data = null, meta = null }) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export default ApiResponse;
