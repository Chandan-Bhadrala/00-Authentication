import { Router } from "express";
import { signup } from "../controllers/user.controller";

const router = Router();

router.post("/signup", upload.single("avatar-file"), signup);
