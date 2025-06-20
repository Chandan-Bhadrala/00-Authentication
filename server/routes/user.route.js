import { Router } from "express";
import { signup } from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.post("/signup", upload.single("avatarFile"), signup);

export default router;
