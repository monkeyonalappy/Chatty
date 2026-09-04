import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { accessStatus, unlockSite } from "../controllers/access.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireSiteAccess } from "../middleware/access.middleware.js";

const router = express.Router();

router.get("/access-status", accessStatus);
router.post("/unlock", unlockSite);
router.post("/signup", requireSiteAccess, signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;