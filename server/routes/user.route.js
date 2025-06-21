import { Router } from "express";
import { signup } from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";
import { signupLimiter } from "../utils/rateLimiter.js";

const router = Router();

router.post("/signup", signupLimiter, upload.single("avatarFile"), signup);

export default router;
