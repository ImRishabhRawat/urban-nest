import express from "express";
import {
	createRoom,
	getAllRooms,
	getFilteredRooms,
	getOwnerRooms,
	getSingleRoom,
} from "../controllers/roomController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router
	.route("/")
	.post(authenticate, restrict(["owner"]), createRoom)
	.get(getAllRooms);

router.get("/filter", getFilteredRooms);
router.get("/:roomId", getSingleRoom);
router.get("/owner/:ownerId", authenticate, restrict(["owner"]), getOwnerRooms);

export default router;
