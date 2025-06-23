import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateOTP } from "../utils/tokenGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { verificationEmailHTML } from "../emailTemplates/verificationEmail.js";
import { createJWT } from "../middleware/jwt.middleware.js";
import { CookieOptions } from "../constants/constants.js";

// 1. Controller for Signing up.
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

    // 1. Check if username exists | verified | emailVerifyTokenExpiry > new Date() | email already registered. If username/email already exists & verified/has pending emailVerifyTokenExpiry. Ask FE to choose a different username.
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

    // 2. Fetch avatar localFilePath from multer storage place.
    console.log(req.file); // To understand req.files object structure
    const avatarLocalPath = req.file?.path;
    console.log("avatarLocalPath", avatarLocalPath);

    // 3. Upload user profile pic to cloudinary inside try-catch to catch cloudinary upload failure error.
    let cloudinaryResponse = ""; // Declaring outside try-catch for scope issues. So, that cloudinaryResponse can be used to create user mongoDB document.
    try {
      cloudinaryResponse = await uploadToCloudinary(avatarLocalPath);
      console.log(
        "File uploaded to the cloudinary & its response",
        cloudinaryResponse
      );

      if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        return sendError(res, {
          statusCode: 400,
          message:
            "Failed to upload user profile pic to CDN & registering user, please try again later..",
        });
      }
    } catch (error) {
      console.log(error);
      return sendError(res, {
        statusCode: 400,
        message:
          "Failed to upload user profile pic to CDN & registering user, please try again later.",
      });
    }

    // 4. Generate & send a token to verify email.
    const token = generateOTP(6);
    try {
      await sendEmail({
        to: "c.bhadrala88@gmail.com",
        subject: "Verification Email",
        htmlTemplate: verificationEmailHTML,
        token,
        category: "Verification Email",
      });
    } catch (error) {
      console.log(error, "Error sending the email with verification token.");
      return sendError(res, {
        statusCode: 400,
        message:
          "Failed to send the email verification token. User not registered, please try again later.",
      });
    }
    // 3. Create a user object & save into the DB.
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
    return sendResponse(res, {
      statusCode: 201,
      message: "User created successfully",
      data: { ...user._doc, password: undefined }, // Can't spread ...user. As user is a mongoose document which contains metadata too. user is not a plain JS object, rather user is a mongoose document.
    });
  } catch (error) {
    console.log(error, "Internal server error while registering user.");
    return sendError(res, {
      statusCode: 500,
      message: "Internal server error while registering user.",
    });
  }
});

// 2. Controller logic for verifying email after signing up.
export const verifyEmail = asyncHandler(async (req, res) => {
  // 1. Fetch the
  // a. "email verification token" &
  // b. "user email" from the req object sent by the FE.

  const { UserEmail, emailVerifyToken } = req.body;

  if (!UserEmail || !emailVerifyToken) {
    return sendError(res, {
      statusCode: 400,
      message: "Missing user email or email verification token.",
    });
  }

  // 2. Fetch the user details from the DB on the basis of the provided email in the req object.

  const userDetailsFromDB = await User.findOne({
    email: UserEmail.toLowerCase(),
  }).select("+fullName +username +email +avatarURL +emailVerifyToken +role");
  if (!userDetailsFromDB) {
    return sendError(res, {
      statusCode: 400,
      message:
        "User not found or verification token expired, please sign up first/again",
    });
  }

  const verificationTokenFromDB = userDetailsFromDB.emailVerifyToken;

  // 3. Compare the email verification token sent by the FE with the one stored in the DB against the same user.
  if (verificationTokenFromDB !== emailVerifyToken) {
    return sendError(res, {
      statusCode: 400,
      message: "Invalid email verification token.",
    });
  }

  // 4. If comparison passed. Update user as verified & mark its emailVerificationToken & emailVerificationTokenExpiry as undefined.
  userDetailsFromDB.isVerified = true;
  userDetailsFromDB.emailVerifyToken = undefined;
  userDetailsFromDB.emailVerifyTokenExpiry = undefined;

  const user = await userDetailsFromDB.save();

  // 5. Sent back the access token in the authorization header & refresh token in the cookie.
  const accessToken = createJWT({ id: user._id, expiresIn: "1h" });
  const refreshToken = createJWT({ id: user._id, expiresIn: "30d" });

  res.header("Authorization", `Bearer ${accessToken}`);
  res.cookie("refreshToken", refreshToken, CookieOptions);

  // 6. Send back user data & Suggest FE to redirect user to the /dashboard or /home page.

  return sendResponse(res, {
    statusCode: 200,
    message: "User verified successfully",
  });
});

// Controller logic for logging in to the app
export const signin = asyncHandler(async (req, res) => {});

// Controller logic for logging out of the app
export const logout = asyncHandler(async (req, res) => {});

// Controller logic for changing/updating password.
export const changePassword = asyncHandler(async (req, res) => {});

// Controller logic for email link to create a fresh password again upon forgetting.
export const forgotPassword = asyncHandler(async (req, res) => {});
