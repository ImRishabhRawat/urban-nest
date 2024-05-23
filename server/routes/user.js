import express from "express";
import {
	deleteUser,
	getSingleUser,
	getAllUsers,
	getUserProfile,
	addFavorite,
	removeFavorite,
	getFavorites,
	updateUserProfile,
} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
const router = express.Router();

router.get("/:id", authenticate, restrict(["student", "owner"]), getSingleUser);
router.delete("/:id", authenticate, restrict(["student"]), deleteUser);
router.put("/:id", authenticate, restrict(["student"]), updateUserProfile);

router.get("/", authenticate, restrict(["admin"]), getAllUsers);
router.get("/profile/me", authenticate, getUserProfile);

router.post(
	"/addFavorite/:userId/:listingId",
	authenticate,
	restrict(["student"]),
	addFavorite
);
router.delete(
	"/removeFavorite/:userId/:listingId",
	authenticate,
	restrict(["student"]),
	removeFavorite
);
router.get(
	"/getFavorites/:userId",
	authenticate,
	restrict(["student"]),
	getFavorites
);

export default router;
