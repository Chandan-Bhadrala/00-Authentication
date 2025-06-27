import { Router } from "express";
import {
  changePassword,
  getUserProfile,
  login,
  logout,
  register,
  requestForgotPasswordOTP,
  resendEmailVerificationToken,
  resetForgotPassword,
  verifyEmail,
  verifyForgotPasswordOTP,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { signupLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/register", signupLimiter, upload.single("avatarFile"), register);

// upload.none() is required below, if sending formData w/o a file. Better to send plain JSON, if i/p data doesn't have a file.
router.post("/verify-email", upload.none(), verifyEmail);
router.post("/resend-verify-email", resendEmailVerificationToken);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
router.post("/change-password", signupLimiter, verifyJWT, changePassword);

// Routes for forgot password flow
router.post(
  "/request-forgot-password-OTP",
  signupLimiter,
  requestForgotPasswordOTP
);
router.post(
  "/verify-forgot-password-OTP",
  signupLimiter,
  verifyForgotPasswordOTP
);
router.post("/forgot-password", signupLimiter, resetForgotPassword);

// Get User profile
router.get("/user-profile", verifyJWT, getUserProfile);

export default router;
