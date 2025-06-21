import jwt from "jsonwebtoken";
import { sendError } from "../utils/sendError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { createJWT } from "./jwt.middleware.js";

// This function sets up access token in the authorization header of res object & refresh token in the res object cookie & in the DB & return "true" if everything goes well.
export const refreshTokenHandler = async (req, res, refreshToken) => {
  try {
    let decodedToken;
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
    return true;
  } catch (error) {
    console.log(error, "Error while refreshing refresh token.");
    return sendError(res, {
      statusCode: 500,
      message:
        "Server Error while refreshing refresh token, please try again later.",
    });
  }
};
