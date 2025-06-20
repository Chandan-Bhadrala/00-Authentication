import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import { sendError } from "../utils/sendError";
import { sendResponse } from "../utils/sendResponse";

export const signup = asyncHandler(async (req, res) => {
  //   Extract info from the req body.
  const { fullName, username, email, password, avatarFile } = req.body;
  console.log(req.file); // Information about the uploaded file
  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername.isVerified) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Username already taken, please try different username",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser.email) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Email already registered, please login",
      });
    }

    const user = new User({ fullName, username, email, password });
    await user.save();

    // Below code line won't trigger pre hook on save event. Below code line will save the user doc directly.
    // const user = User.create({ fullName, password, username, email });

    // TODO: Upload user profile pic to cloudinary.
    // TODO: Generate & send an verify email.
    sendResponse(res, {
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error, "Internal server error while registering user.");
    sendError(res, {
      statusCode: 500,
      message: "Internal server error while registering user.",
    });
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {});

export const signin = asyncHandler(async (req, res) => {});

export const logout = asyncHandler(async (req, res) => {});

export const changePassword = asyncHandler(async (req, res) => {});

export const forgotPassword = asyncHandler(async (req, res) => {});
