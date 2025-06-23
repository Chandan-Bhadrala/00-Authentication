import { Router } from "express";
import { signup, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { signupLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/signup", signupLimiter, upload.single("avatarFile"), signup);
router.post("/verify-email", verifyEmail);

export default router;
