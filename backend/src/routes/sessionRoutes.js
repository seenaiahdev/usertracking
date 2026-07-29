// Routes for class sessions listing endpoint
import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getAllSessions } from "../controllers/sessionController.js";

const router = Router();

router.get("/", verifyToken, getAllSessions);

export default router;
