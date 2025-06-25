import jwt from "jsonwebtoken";
import { CookieOptions } from "../constants/constants.js";
import { User } from "../models/user.model.js";
import { sendError } from "../utils/sendError.js";
import { createJWT } from "./jwt.middleware.js";

// This function sets up access token in the authorization header of res object & refresh token in the res object cookie & in the DB & return "true" if everything goes well.
export const refreshTokenHandler = async (req, res, refreshToken) => {
  try {
    let decodedToken;
    try {
      // 01. Verify the refresh token.
      decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error, "Invalid refresh token.");
      return sendError(res, {
        statusCode: 401,
        message: "Invalid credentials, please login again.",
      });
    }

    // 02. Adding user decoded id in req object.
    req.userId = decodedToken.id;

    // 03. Creating new access token & adding it in the res object for next controller.
    const newAccessToken = createJWT({
      id: decodedToken.id,
      expiresIn: "1h",
    });

    res.header("Authorization", `Bearer ${newAccessToken}`);

    // 04. Setting up refreshed refresh token in the user cookies
    const newRefreshToken = createJWT({
      id: decodedToken.id,
      expiresIn: "30d",
    });
    res.cookie("refreshToken", newRefreshToken, CookieOptions);

    // 05. Updating/Refreshing user refresh token in the DB too.
    const user = await User.findByIdAndUpdate(
      decodedToken.id,
      {
        refreshToken: newRefreshToken,
      },
      { new: true }
    );

    req.user = user;
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
