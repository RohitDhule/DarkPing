import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { translateText } from "../controllers/translation.controller.js";

const router = express.Router();

router.post("/translate", protectRoute, translateText);

export default router;