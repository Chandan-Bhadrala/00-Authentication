import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/sendError.js";
import { refreshTokenHandler } from "./refreshTokenHandler.middleware.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// Generic function to create a JWT token.
export const createJWT = ({ id, expiresIn }) => {
  try {
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
    return jwtToken;
  } catch (error) {
    console.log(error, "Error while signing JWT token");
    throw new ApiError({
      statusCode: 500,
      message: "Failed to generate JWT token.",
      errors: [error.message], // optional for more context
    });
  }
};

// This function will populate req object with "userId field" on successful JWT verification.
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let accessToken;

    // Only populate accessToken, if authorization headers starts with the "Bearer "
    if (req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.replace("Bearer ", "");
    }

    const refreshToken = req.cookies?.refreshToken;

    // Early return on No token receive.
    if (!refreshToken && !accessToken) {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid credentials, please login again.",
      });
    }
    let decodedToken = "";

    // If there is access token, then decode it and populate the req token with the user Id & user object.
    if (accessToken) {
      try {
        decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.userId = decodedToken.id;
        const user = await User.findOne({ _id: req.userId });
        req.user = user;
        return next();
      } catch (error) {
        console.log(error, "Invalid accessToken.");
        return sendError(res, {
          statusCode: 401,
          message: "Invalid credentials, please login again.",
        });
      }
    }
    // If there is no access token, check for refresh token & then populate the req token with the user Id. And refresh refresh Token in the DB too.
    if (refreshToken) {
      const result = await refreshTokenHandler(req, res, refreshToken);
      if (result) {
        return next();
      } else {
        return sendError(res, {
          statusCode: 401,
          message: "Invalid credentials, please login again.",
        });
      }
    }

    if (!decodedToken) {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid credentials, please login again.",
      });
    }
  } catch (error) {
    console.log(error, "Server Error while verifying req JWT");
    return sendError(res, {
      statusCode: 500,
      message: "Server Error while verifying req JWT",
    });
  }
});
