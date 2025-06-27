import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/sendError.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateOTP } from "../utils/tokenGenerator.js";
import { sendEmail } from "../utils/sendEmailResend.js";
import { verificationEmailHTML } from "../emailTemplates/verificationEmail.js";
import { createJWT } from "../middleware/jwt.middleware.js";
import {
  CookieOptions,
  EMAIL_TOKEN_EXPIRY_MS,
} from "../constants/constants.js";

// 01. Register Controller.
export const register = asyncHandler(async (req, res) => {
  // 00a. Extract info from the req body.
  const { fullName, username, email, password, confirmPassword } = req.body;
  const avatarFile = req.file;

  // console.log(req.file); // Information about the uploaded file

  // 00b. Validate all required files are sent by the FE.
  if (
    [fullName, email, username, password].some(
      (field) => typeof field !== "string" || field?.trim() === ""
    ) ||
    !avatarFile // avatarFile can't be up in the array for checking, as avatarFile is an object & not a string.
  ) {
    return sendError(res, {
      statusCode: 400,
      message: "All fields are required.",
    });
  }

  // 00c. Password must be same as confirmPassword.
  if (password !== confirmPassword) {
    return sendError(res, {
      statusCode: 400,
      message: "Password & Confirm Password must be same",
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
      } else if (
        usernameAvailabilityVerification.email.toLowerCase() ===
        email.toLowerCase()
      ) {
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
    // 5. Create a user object & save into the DB.
    const user = new User({
      fullName,
      username,
      email: email.toLowerCase(),
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
      data: user,
    });
  } catch (error) {
    console.log(error, "Internal server error while registering user.");
    return sendError(res, {
      statusCode: 500,
      message: "Internal server error while registering user.",
    });
  }
});

// 02. Verifying email after signing up Controller.
export const verifyEmail = asyncHandler(async (req, res) => {
  // 01. Fetch the
  // a. "email verification token" &
  // b. "user email" from the req object sent by the FE.

  const { userEmail, emailVerifyToken } = req.body;
  console.log(userEmail, emailVerifyToken);
  if (!userEmail || !emailVerifyToken) {
    return sendError(res, {
      statusCode: 400,
      message: "Missing user email or email verification token.",
    });
  }

  // 02. Fetch the user details from the DB on the basis of the provided email in the req object.

  const userDetailsFromDB = await User.findOne({
    email: userEmail.toLowerCase(),
  }).select("+fullName +username +email +avatarURL +emailVerifyToken +role");
  if (!userDetailsFromDB) {
    return sendError(res, {
      statusCode: 400,
      message:
        "User not found or verification token expired, please sign up first/again",
    });
  }

  // 03. Compare the email verification token sent by the FE with the one stored in the DB against the same user.
  const tokenMatch = await userDetailsFromDB.isTokenMatch(
    emailVerifyToken,
    "emailVerifyToken"
  );
  if (!tokenMatch) {
    return sendError(res, {
      statusCode: 400,
      message: "Invalid email verification token.",
    });
  }

  // 04. If comparison passed. Update user as verified & mark its emailVerificationToken & emailVerificationTokenExpiry as undefined.
  userDetailsFromDB.isVerified = true;
  userDetailsFromDB.emailVerifyToken = undefined;
  userDetailsFromDB.emailVerifyTokenExpiry = undefined;

  const user = await userDetailsFromDB.save();

  // 05. Sent back the access token in the authorization header & refresh token in the cookie.
  const accessToken = createJWT({ id: user._id, expiresIn: "1h" });
  const refreshToken = createJWT({ id: user._id, expiresIn: "30d" });

  res.header("Authorization", `Bearer ${accessToken}`);
  res.cookie("refreshToken", refreshToken, CookieOptions);

  // 06. Send back user data & Suggest FE to redirect user to the /dashboard or /home page.

  return sendResponse(res, {
    statusCode: 200,
    message: "User verified successfully",
    data: user,
    meta: {
      accessToken,
    },
  });
});

// 03. Controller logic for resending the token for email verification. User is limited to request for another OTP within 2 minutes, using DB query for a stored cool down period. Rather use express rate limiter as a middleware. To save onto the DB Query.
export const resendEmailVerificationToken = asyncHandler(async (req, res) => {
  // 1. Extract info from the req body & validate.
  const { email } = req.body;

  // Validate email sent by the FE.
  if (!email) {
    return sendError(res, {
      statusCode: 400,
      message: "Email is required to resend the verification token.",
    });
  }

  try {
    // 2a. Check if user exists in the DB.
    const userExist = await User.findOne({ email: email.toLowerCase() });

    if (!userExist) {
      return sendError(res, {
        statusCode: 400,
        message: "User doesn't exist, please register first/again",
      });
    }

    // 2b. Check if user is already verified.
    if (userExist.isVerified) {
      return sendResponse(res, {
        statusCode: 200,
        message: "User already verified.",
      });
    }

    // 2c. Check if cool down is still active for another token request in the DB.
    if (
      userExist.tokenResendCoolDownExpiry &&
      userExist.tokenResendCoolDownExpiry > Date.now()
    ) {
      const remainingMs = userExist.tokenResendCoolDownExpiry - Date.now();
      const remainingSec = Math.ceil(remainingMs / 1000);

      return sendError(res, {
        statusCode: 429,
        message: `Please wait for ${remainingSec} seconds before requesting again.`,
      });
    }
    // 3. If user exists & is not verified. Then, generate & send a token to verify email.
    const newToken = generateOTP(6);
    try {
      await sendEmail({
        to: "c.bhadrala88@gmail.com",
        subject: "Verification Email",
        htmlTemplate: verificationEmailHTML,
        token: newToken,
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

    // 4. Save the newToken, its new updated expiry time & cool down time for another OTP request in the DB for later comparison & to create temporary halt from OTP requests.
    userExist.emailVerifyToken = newToken;
    userExist.emailVerifyTokenExpiry = EMAIL_TOKEN_EXPIRY_MS;
    userExist.tokenResendCoolDownExpiry = Date.now() + 2 * 60 * 1000; // 2 mins
    await userExist.save();

    return sendResponse(res, {
      statusCode: 200,
      message: "New email verification token sent successfully.",
    });
  } catch (error) {
    console.log(
      error,
      "Internal server error while re-sending the OTP to the user. Please try again later."
    );
    return sendError(res, {
      statusCode: 500,
      message:
        "Internal server error while re-sending the OTP to the user. Please try again later",
    });
  }
});

// 04. Logging in Controller logic.
export const login = asyncHandler(async (req, res) => {
  // 00a. Extract info from the req body.
  const { email, password } = req.body;

  // 00b. Validate all required files are sent by the FE.
  if (!email || !password) {
    return sendError(res, {
      statusCode: 400,
      message: "All fields are required.",
    });
  }

  try {
    // 01. Fetch user details
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+fullName +username +email +avatarURL +emailVerifyToken +role");

    if (!user) {
      return sendError(res, {
        statusCode: 400,
        message: "User doesn't exist. Please register first.",
      });
    }

    // 02. Match password
    const verifyPassword = await user.isTokenMatch(password, "password");

    if (!verifyPassword) {
      return sendError(res, {
        statusCode: 400,
        message: "Invalid credentials",
      });
    }

    // 03. Check even if user verified or not.
    if (!user.isVerified) {
      return sendError(res, {
        statusCode: 403,
        message: "Please verify your email before logging in.",
      });
    }

    // 04. Sent back the access token in the authorization header & refresh token in the cookie.
    const accessToken = createJWT({ id: user._id, expiresIn: "1h" });
    const refreshToken = createJWT({ id: user._id, expiresIn: "30d" });

    // 05. Update the refresh token in the DB for the user.
    user.refreshToken = refreshToken;
    await user.save();

    res.header("Authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, CookieOptions);

    // 06. Send back user data.
    return sendResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      data: user,
      meta: {
        accessToken,
      },
    });
  } catch (error) {
    console.log(error, "Internal server error while registering user.");
    return sendError(res, {
      statusCode: 500,
      message: "Internal server error while registering user.",
    });
  }
});

// 05. Logging out Controller logic.
export const logout = asyncHandler(async (req, res) => {
  // 01a. Check for access token || refresh token in the headers and in cookie respectively.
  // 01b. Applied verifyJWT middleware on the logout route for verification of the user.

  // 02. Fetch user details from the JWT middleware req populated object.
  const user = req.user;

  // 03a. If, either of token present. Log user out by clearing tokens at client side & in the DB too.
  // 03b. Update the refresh token in the DB for the user.
  user.refreshToken = "";
  await user.save();

  // 03c. Clear user header & cookie for the tokens.
  res.clearCookie("refreshToken", CookieOptions);
  res.setHeader("Authorization", "");

  // 04. Send a success response
  return sendResponse(res, {
    statusCode: 200,
    message: "User logged out successfully",
  });
});

// 06. Changing/Updating Password Controller.
export const changePassword = asyncHandler(async (req, res) => {
  // 01. Extract email, oldPassword & newPassword & confirmPassword from the req.body & check newPassword === confirmPassword, if not early return with sendError.
  const { email, oldPassword, newPassword, confirmPassword } = req.body;
  const user = req.user;
  if (
    [email, oldPassword, newPassword, confirmPassword].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    return sendError(res, {
      statusCode: 400,
      message: "All fields are required.",
    });
  }
  if (newPassword !== confirmPassword) {
    return sendError(res, {
      statusCode: 400,
      message: "New password & confirm password must be same.",
    });
  }
  // 02. Check for user tokens & existence in the DB by applying verifyJWT middleware & extract user details from the req object populated by the verifyJWT middleware. # Done above.

  // 03. Compare oldPassword using user.isTokenMatch(oldPassword, "password"), to check if sent password is correct. Otherwise return user on password match failure.
  const isPasswordCorrect = await user.isTokenMatch(oldPassword, "password");
  if (!isPasswordCorrect) {
    return sendError(res, {
      statusCode: 400,
      message: "Old password is incorrect.",
    });
  }
  // 04. If tokens, email, oldPassword. All is good as per the DB. Change password field in the DB with the newPassword in the DB.

  user.password = newPassword;
  user.refreshToken = "";
  await user.save();

  // 05. Clear user header & cookie for the tokens.
  res.clearCookie("refreshToken", CookieOptions);
  res.setHeader("Authorization", "");

  // 05. Sent back the sendResponse with user details "- password".
  sendResponse(res, {
    statusCode: 200,
    message: "Password updated successfully",
    data: user,
  });
});

// 07a. Controller logic to email OTP to create a fresh password again upon forgetting the password.
export const requestForgotPasswordOTP = asyncHandler(async (req, res) => {
  // 01. Extract email from the req.body & check if user exists in our DB.
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return sendError(res, {
      statusCode: 400,
      message: "Email is required.",
    });
  }
  try {
    // 01a. Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, {
        statusCode: 400,
        message: "User does't exists. Please register first.",
      });
    }
    // 02. Generate OTP. Save it in the DB & send it to the client using sendEmail function.
    const OTP = generateOTP(6);
    user.forgotPasswordVerifyToken = OTP;
    user.forgotPasswordTokenExpiry = EMAIL_TOKEN_EXPIRY_MS;
    await sendEmail({
      to: "c.bhadrala88@gmail.com",
      subject: "Forgot Password OTP",
      htmlTemplate: verificationEmailHTML,
      token: OTP,
      category: "Forgot Password",
    });
    await user.save();

    return sendResponse(res, { statusCode: 200, message: "OTP mailed." });
  } catch (error) {
    console.log(error);
    return sendError(res, {
      statusCode: 500,
      message: "Failed to mail forgot password OTP, please try again later.",
    });
  }
});

// 07b. Controller logic to verify forgot password emailed OTP.
export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  // 01. Extract {email, OTP} from the req.body.
  const { email, OTP } = req.body;
  if (!email || typeof email !== "string" || !OTP) {
    return sendError(res, {
      statusCode: 400,
      message: "Email & OTP is required.",
    });
  }
  // 02. Check if user exists in the DB. If not early return with message, "No user exists, please register first."
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendError(res, {
      statusCode: 400,
      message: "User doesn't exist, please register first.",
    });
  }
  // 03a. If user exists & OTP is correct/matched.
  if (user.forgotPasswordTokenExpiry < Date.now()) {
    return sendError(res, {
      statusCode: 400,
      message: "OTP expired, Please request a new one.",
    });
  }

  const isMatch = await user.isTokenMatch(OTP, "forgotPasswordVerifyToken");
  if (!isMatch) {
    return sendError(res, { statusCode: 400, message: "Invalid OTP" });
  }
  // Send confirmation to FE to redirect user to forgot password page to reset the password.
  sendResponse(res, {
    statusCode: 200,
    message:
      "Email & token verified successfully, redirect user to reset password page",
    data: user,
  });
});

// 07c. Controller logic to reset password using emailed OTP to create a fresh password again upon forgetting old password.
export const resetForgotPassword = asyncHandler(async (req, res) => {
  // 01. Extract {email, OTP, newPassword, confirmPassword} from the req.body.
  const { email, OTP, newPassword, confirmPassword } = req.body;
  if (
    [email, OTP, newPassword, confirmPassword].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    return sendError(res, {
      statusCode: 400,
      message: "All fields are required.",
    });
  }

  if (newPassword !== confirmPassword) {
    return sendError(res, {
      statusCode: 400,
      message: "New password must match confirm password",
    });
  }
  // 02. Check again, if user exists in the DB. If not early return with message, "No user exists, please register first."
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendError(res, {
      statusCode: 400,
      message: "User doesn't exists, please register first.",
    });
  }
  // 03. Check again, if user exists & OTP is correct/matched, send confirmation to FE to redirect user to forgot password page to reset the password. Otherwise return response, "Invalid request".
  if (user.forgotPasswordTokenExpiry < Date.now()) {
    return sendError(res, {
      statusCode: 400,
      message: "OTP has expired. Please request a new one.",
    });
  }

  const isMatch = await user.isTokenMatch(OTP, "forgotPasswordVerifyToken");
  if (!isMatch) {
    return sendError(res, { statusCode: 400, message: "Invalid OTP" });
  }
  // 04. Update the user password & set the tokens. Ask, FE to redirect to home page.
  user.password = newPassword;

  // 05. Create & send back the access token in the authorization header & refresh token in the cookie & update the refresh token in the DB.
  const accessToken = createJWT({ id: user._id, expiresIn: "1h" });
  const refreshToken = createJWT({ id: user._id, expiresIn: "30d" });

  user.refreshToken = refreshToken;
  user.forgotPasswordVerifyToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  res.header("Authorization", `Bearer ${accessToken}`);
  res.cookie("refreshToken", refreshToken, CookieOptions);

  // 06. Send back user data.
  return sendResponse(res, {
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
    meta: {
      accessToken,
    },
  });
});

// 08. Get User profile
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return sendError(res, { statusCode: 401, message: "User not found." });
    }
    return sendResponse(res, {
      statusCode: 200,
      message: "User details retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return sendError(res, {
      statusCode: 500,
      message: "Failed to get user profile. please try again.",
    });
  }
});
