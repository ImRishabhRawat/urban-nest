import express from "express";
import {
	getOwnerProfile,
	updateOwnerProfile,
	deleteOwner,
} from "../controllers/ownerController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/profile/me", authenticate, restrict(["owner"]), getOwnerProfile);
router.put("/profile", authenticate, restrict(["owner"]), updateOwnerProfile);
router.delete("/:id", authenticate, restrict(["owner"]), deleteOwner);

export default router;