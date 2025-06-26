import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getTestHistory, transcribeAndEvaluate } from "../controller/speechController.js";
import { protectRoute } from "../middleware/authMiddleWare.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use memory storage instead of saving files to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// POST: Audio upload, transcription, evaluation
router.post("/upload", protectRoute, upload.single("audio"), transcribeAndEvaluate);

// GET: User's test history
router.get("/get-test-history", protectRoute, getTestHistory);

export default router;
