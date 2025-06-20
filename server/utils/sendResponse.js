import ApiResponse from "./ApiResponse.js";

export const sendResponse = (
  res,
  { statusCode, message, data = null, meta = null }
) => {
  const response = new ApiResponse({ statusCode, message, data, meta });
  return res.status(statusCode).json(response);
};
