import express from "express";
import { signupAdmin } from "../controllers/adminController.js";
import { signinAdmin } from "../controllers/adminController.js";
import { getVisitorsLog } from "../controllers/adminController.js";
import { updateSaveToLogs } from "../controllers/adminController.js";
import { generateReports } from "../controllers/adminController.js";
import { registerInmate } from "../controllers/adminController.js";
import { uploadMugshots } from "../helper/uploadMugshots.js";
import { getInmates } from "../controllers/adminController.js";
import { updateInmateUsers } from "../controllers/adminController.js";
import { updateVisitorUsers } from "../controllers/adminController.js";
import { changeAdminPassword } from "../controllers/adminController.js";
import { googleSignInAdmin } from "../controllers/adminController.js";
import { ipLimiter, userLimiter } from "../helper/rateLimiter.js";

const router = express.Router();

router.post("/google-signin", googleSignInAdmin);
router.post("/signup", signupAdmin);
router.post("/signin", signinAdmin);
router.get("/visitorsLogs", getVisitorsLog);
router.patch("/logs/:id", updateSaveToLogs);
router.post("/generate", generateReports);
router.post("/inmates", uploadMugshots, registerInmate);
router.get("/listofinmates", getInmates);
router.patch("/update/inmate/:id", updateInmateUsers);
router.patch("/update/visitor/:id", updateVisitorUsers);
router.post("/confirm/:id", [ipLimiter, userLimiter, changeAdminPassword]);

export default router;
