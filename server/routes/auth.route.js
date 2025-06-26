import { Router } from "express";
import {
  logout,
  resendEmailVerificationToken,
  login,
  register,
  verifyEmail,
  forgotPassword,
  changePassword,
  getUserProfile,
} from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { signupLimiter } from "../middleware/rateLimiter.middleware.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";

const router = Router();

router.post("/register", signupLimiter, upload.single("avatarFile"), register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendEmailVerificationToken);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.post("/change-password", signupLimiter, verifyJWT, changePassword);
router.post("/forgot-password", signupLimiter, verifyJWT, forgotPassword);
router.get("/user-profile",  verifyJWT, getUserProfile);


export default router;
