import express from "express";
import { addToWatchlist, removeFromWatchlist,updateWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// router.use(authMiddleware);
router.post("/", authMiddleware, addToWatchlist);
router.delete("/:id", authMiddleware, removeFromWatchlist);
router.put("/:id", authMiddleware, updateWatchlist);

export default router;