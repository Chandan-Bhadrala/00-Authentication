import { Router } from "express";
import { signup } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { signupLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/signup", signupLimiter, upload.single("avatarFile"), signup);

export default router;
