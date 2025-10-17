import express from "express";
import { signupAdmin } from "../controllers/adminController.js";
import { signinAdmin } from "../controllers/adminController.js";
import { getVisitorsLog } from "../controllers/adminController.js";
import { updateSaveToLogs } from "../controllers/adminController.js";
import { generateReports } from "../controllers/adminController.js";
import { registerInmate } from "../controllers/adminController.js";
import { uploadMugshots } from "../helper/uploadMugshots.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", signinAdmin);
router.get("/visitorsLogs", getVisitorsLog);
router.patch("/logs/:id", updateSaveToLogs);
router.post("/generate", generateReports);
router.post("/inmates", uploadMugshots, registerInmate);

export default router;
