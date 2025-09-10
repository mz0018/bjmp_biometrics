import express from "express";
import { signupAdmin } from "../controllers/adminController.js";
import { signinAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", signinAdmin)

export default router;
