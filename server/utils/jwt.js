import jwt from "jsonwebtoken";
import { sendError } from "./sendError";
import asyncHandler from "./asyncHandler";
import { User } from "../models/user.model";

// Generic function to create a JWT token.
const createJWT = ({ id, expiresIn }) => {
  try {
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
    return jwtToken;
  } catch (error) {
    console.log(error, "Error while signing JWT token");
    return sendError(res, {
      statusCode: 500,
      message: "Error while signing JWT token, please try again later",
    });
  }
};

// This function will populate req object with "userId field" on successful JWT verification.
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let accessToken;

    // Only populate accessToken, if authorization headers starts with the "Bearer "
    if (req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.replace("Bearer ", "");
    }

    const refreshToken = req.cookies?.refreshToken;

    // Early return on No token receive.
    if (!(refreshToken && accessToken)) {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid credentials, please login again.",
      });
    }
    let decodedToken = "";

    // If there is access token, then decode it and populate the req token with the user Id.
    if (accessToken) {
      try {
        decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.userId = decodedToken.id;
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
    else if (refreshToken) {
      try {
        try {
          decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
          console.log(error, "Invalid accessToken.");
          return sendError(res, {
            statusCode: 401,
            message: "Invalid credentials, please login again.",
          });
        }

        // Adding user decoded id in req object.
        req.userId = decodedToken.id;

        // Creating new access token & adding it in the res object for next controller.
        const newAccessToken = createJWT({
          id: decodedToken.id,
          expiresIn: "1h",
        });

        res.header("Authorization", `Bearer ${newAccessToken}`);

        // Setting up refreshed refresh token in the user cookies
        const options = {
          httpOnly: true,
          secure: true,
          sameSite: "strict", // Prevents CSRF in most browsers
        };
        const newRefreshToken = createJWT({
          id: decodedToken.id,
          expiresIn: "30d",
        });
        res.cookie("refreshToken", newRefreshToken, options);

        // Updating/Refreshing user refresh token in the DB.
        const user = await User.findByIdAndUpdate(
          decodedToken.id,
          {
            refreshToken: newRefreshToken,
          },
          { new: true }
        ).select("-password");

        res.user = user;
      } catch (error) {
        console.log(error, "Error while refreshing refresh token.");
        return sendError(res, {
          statusCode: 500,
          message:
            "Server Error while refreshing refresh token, please try again later.",
        });
      }
      return next();
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
