// GLOBAL ERROR HANDLER FOR ALL THE EXPRESS ROUTES.
// server/middlewares/error.middleware.js
import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // If the error is not an instance of our ApiError, wrap it
  if (!(err instanceof ApiError)) {
    err = new ApiError({
      statusCode: err.statusCode || 500,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
    });
  }

  return res.status(err.statusCode).json(err.toJSON());
};
