import ApiError from "./ApiError.js";

export const sendError = (res, { statusCode, message, errors = [] }) => {
  const error = new ApiError({ statusCode, message, errors });
  return res.status(statusCode).json(error.toJSON());
};
