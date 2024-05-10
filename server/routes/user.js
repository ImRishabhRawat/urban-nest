import express from "express";
import {
	updateUser,
	deleteUser,
	getSingleUser,
	getAllUsers,
	getUserProfile,
	addFavorite,
	removeFavorite,
} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
const router = express.Router();

router.get("/:id", authenticate, restrict(["student"]), getSingleUser);
router.delete("/:id", authenticate, restrict(["student"]), deleteUser);
router.put("/:id", authenticate, restrict(["student"]), updateUser);
router.get("/", authenticate, restrict(["admin"]), getAllUsers);
router.get("/profile/me", authenticate, restrict(["student"]), getUserProfile);

// Add a listing to favorites
router.post("/:id/favorites/:listingId", authenticate, addFavorite);

// Remove a listing from favorites
router.delete("/:id/favorites/:listingId", authenticate, removeFavorite);


export default router;
