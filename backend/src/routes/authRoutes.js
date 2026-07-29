// Routes for authentication and user profile endpoints
import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/authController.js";

const router = Router();

router.get("/profile", verifyToken, getUserProfile);

export default router;
