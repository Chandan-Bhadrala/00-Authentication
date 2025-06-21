import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateOTP } from "../utils/tokenGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { verificationEmailHTML } from "../emailTemplates/verificationEmail.js";

export const signup = asyncHandler(async (req, res) => {
  // Extract info from the req body.
  const { fullName, username, email, password } = req.body;

  const avatarFile = req.file;

  // console.log(req.file); // Information about the uploaded file

  // Validate all required files are sent by the FE.
  if (
    [fullName, email, username, password].some(
      (field) => field?.trim() === ""
    ) ||
    !avatarFile // avatarFile can't be up in the array for checking, as avatarFile is an object & not a string.
  ) {
    console.log(fullName, email, username, password);
    return sendError(res, {
      statusCode: 400,
      message: "All fields are required.",
    });
  }

  try {
    const usernameAvailabilityVerification = await User.findOne({
      username,
    });

    // Check if username exists | verified | emailVerifyTokenExpiry > new Date() | email already registered. If username/email already exists & verified/has pending emailVerifyTokenExpiry. Ask FE to choose a different username.
    if (usernameAvailabilityVerification) {
      if (usernameAvailabilityVerification.isVerified) {
        return sendError(res, {
          statusCode: 400,
          message: "Username already taken. Please try a different one.",
        });
      } else if (
        usernameAvailabilityVerification.emailVerifyTokenExpiry > new Date()
      ) {
        return sendError(res, {
          statusCode: 400,
          message:
            "Username is temporarily reserved. Please try later or choose another one.",
        });
      } else if (usernameAvailabilityVerification.email === email) {
        return sendError(res, {
          statusCode: 400,
          message:
            "Email already registered, please login or try forgot password page to reset password.",
        });
      } else {
        await User.deleteOne({ _id: usernameAvailabilityVerification._id });
      }
    }

    // Fetch avatar localFilePath from multer storage place.
    console.log(req.file); // To understand req.files object structure
    const avatarLocalPath = req.file?.path;
    console.log("avatarLocalPath", avatarLocalPath);

    // Upload user profile pic to cloudinary inside try-catch to catch cloudinary upload failure error.
    let cloudinaryResponse = ""; // Declaring outside try-catch for scope issues. So, that cloudinaryResponse can be used to create user mongoDB document.
    try {
      cloudinaryResponse = await uploadToCloudinary(avatarLocalPath);
      console.log(
        "File uploaded to the cloudinary & its response",
        cloudinaryResponse
      );
    } catch (error) {
      console.log(error);
      return sendError(res, {
        statusCode: 400,
        message:
          "Failed to upload user profile pic to CDN & registering user, please try again later.",
      });
    }

    // Generate & send a token to verify email.
    const token = generateOTP(6);
    sendEmail({
      to: "c.bhadrala88@gmail.com",
      subject: "Verification Email",
      htmlTemplate: verificationEmailHTML,
      token,
      category: "Verification Email",
    });
    // Create a user object & save into the DB.
    const user = new User({
      fullName,
      username,
      email,
      password,
      avatarURL: cloudinaryResponse.secure_url,
      emailVerifyToken: token,
    });
    await user.save();
    console.log("document saved in the DB");
    // Below code line won't trigger pre hook on save event. Below code line will save the user doc directly.
    // const user = User.create({ fullName, password, username, email });

    // Send the response to the FE
    sendResponse(res, {
      statusCode: 201,
      message: "User created successfully",
      data: { ...user._doc, password: undefined }, // Can't spread ...user. As user is a mongoose document which contains metadata too. user is not a plain JS object, rather user is a mongoose document.
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
