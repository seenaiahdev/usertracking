// Routes for video progress tracking endpoints
import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getVideoProgress, saveVideoProgress } from "../controllers/progressController.js";

const router = Router();

router.get("/:videoId", verifyToken, getVideoProgress);
router.post("/:videoId", verifyToken, saveVideoProgress);

export default router;
