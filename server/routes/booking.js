import express from "express";
import {
	approve,
	countBookingsByListing,
	createBooking,
	deleteBooking,
	getBooking,
	getBookingsByListing,
	getBookingsByStudent,
} from "../controllers/bookingController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.post("/:listingId", authenticate, restrict(["student"]), createBooking);

router.get("/:bookingId", authenticate, getBooking);

router.get(
	"/listing/:listingId",
	authenticate,
	getBookingsByListing
);

router.get(
	"/student/:studentId",
	authenticate,
	restrict(["student"]),
	getBookingsByStudent
);

router.post(
	"/:bookingId/approve",
	authenticate,
	restrict(["owner", "student"]),
	approve
);

router.delete(
	"/:id",
	authenticate,
	deleteBooking
);

router.get(
	"/listing/:listingId/count",
	authenticate,
	restrict(["owner"]),
	countBookingsByListing
);

export default router;
