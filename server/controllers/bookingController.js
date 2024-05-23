import User from '../models/UserSchema.js'
import Owner from '../models/OwnerSchema.js'
import Booking from '../models/BookingSchema.js'
import Room from '../models/RoomSchema.js';

export const createBooking = async (req, res) => {
	const { user, owner, room, price, visitDates } = req.body;

	try {
		// Validate user
		const userRecord = await User.findById(user);
		if (!userRecord) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Validate owner
		const ownerRecord = await Owner.findById(owner);
		if (!ownerRecord) {
			return res.status(404).json({
				success: false,
				message: "Owner not found",
			});
		}

		// Validate room
		const roomRecord = await Room.findById(room);
		if (!roomRecord) {
			return res.status(404).json({
				success: false,
				message: "Room not found",
			});
		}

		 const existingBooking = await Booking.findOne({
				user,
				room: room,
				$or: [
					{
						"visitDates.startDate": {
							$lte: visitDates.endDate,
							$gte: visitDates.startDate,
						},
					},
					{
						"visitDates.endDate": {
							$gte: visitDates.startDate,
							$lte: visitDates.endDate,
						},
					},
					{
						"visitDates.startDate": { $lte: visitDates.startDate },
						"visitDates.endDate": { $gte: visitDates.endDate },
					},
				],
			});

			if (existingBooking) {
				return res.status(400).json({
					success: false,
					message:
						"Already booked",
				});
			}

		// Create new booking
		const newBooking = new Booking({
			user,
			owner,
			room,
			price,
			visitDates,
		});

		const savedBooking = await newBooking.save();

		// Update user and owner with the new booking
		await User.findByIdAndUpdate(user, {
			$push: { bookings: savedBooking._id },
		});

		await Owner.findByIdAndUpdate(owner, {
			$push: { bookings: savedBooking._id },
		});

		res.status(201).json({
			success: true,
			message: "Booking created successfully",
			data: savedBooking,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Failed to create booking, something went wrong",
		});
	}
};


export const getBooking = async (req, res) => {
	const { bookingId } = req.params;
	try {
		const booking = await Booking.findById(bookingId)
			.populate("user", "name email")
			.populate("owner", "name email")
			.populate("room", "title description");
		if (!booking) {
			return res
				.status(404)
				.json({ success: false, message: "Booking not found" });
		}

		// Verify ownership
		if (
			req.user.role === "owner" &&
			booking.owner.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		// Verify booking belongs to the user
		if (
			req.user.role === "student" &&
			booking.user._id.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		res.status(200).json({ success: true, data: booking });
	} catch (error) {
		console.error("Error fetching booking:", error);
		res
			.status(500)
			.json({
				success: false,
				message: "Failed to fetch booking",
				error: error.message,
			});
	}
};

export const getBookingsByListing = async (req, res) => {
	const { listingId } = req.params;
	console.log("Listing ID:", listingId); // Debug log

	try {
		const room = await Room.findById(listingId);
		console.log("Room fetched:", room); // Debug log

		if (!room) {
			return res.status(404).json({
				success: false,
				message: "Room not found",
			});
		}


		const bookings = await Booking.find({ room: listingId })
			.populate("user", "name email")
			.populate("owner", "name email")
			.populate("room", "title description");
		console.log("Bookings fetched:", bookings); // Debug log

		if (!bookings || bookings.length === 0) {
			return res.status(200).json({ success: true, data: [] }); // Return an empty list with 200 status
		}

		res.status(200).json({ success: true, data: bookings });
	} catch (error) {
		console.error("Error fetching bookings by listing:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch bookings, something went wrong",
			error: error.message,
		});
	}
};

export const getBookingsByStudent = async (req, res) => {
	const { studentId } = req.params;
	try {
		// Ensure the user requesting is the owner of the reservations
		if (req.userId !== studentId && req.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to view these reservations",
			});
		}

		const bookings = await Booking.find({ user: studentId })
			.populate("user", "name email")
			.populate("owner", "name email")
			.populate({
				path: "room",
				select: "-__v", // Excludes the `__v` field if you don't want it
			});

		if (!bookings || bookings.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No bookings found for this student",
			});
		}

		res.status(200).json({ success: true, data: bookings });
	} catch (error) {
		console.error("Error fetching bookings by student:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch bookings, something went wrong",
			error: error.message,
		});
	}
};

export const approve = async (req, res) => {
	const { bookingId } = req.params;
	const { userType } = req.body; // 'student' or 'owner'

	try {
		const booking = await Booking.findById(bookingId);
		if (!booking) {
			return res
				.status(404)
				.json({ success: false, message: "Booking not found" });
		}

		// Verify ownership
		if (
			userType === "owner" &&
			booking.owner.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		// Verify booking belongs to the user
		if (
			userType === "student" &&
			booking.user.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ success: false, message: "Unauthorized access" });
		}

		if (userType === "student") {
			booking.studentApproved = true;
		} else if (userType === "owner") {
			booking.ownerApproved = true;
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Invalid user type" });
		}

		if (booking.studentApproved && booking.ownerApproved) {
			booking.status = "approved";

			// Update room status to 'listed'
			const room = await Room.findById(booking.room);
			room.status = "listed";
			room.title += " - Listed";
			await room.save();

			// Cancel other bookings for the same room
			await Booking.updateMany(
				{ room: booking.room, _id: { $ne: booking._id } },
				{ status: "cancelled" }
			);
		}

		const updatedBooking = await booking.save();
		res.status(200).json({ success: true, data: updatedBooking });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to approve booking",
			error: error.message,
		});
	}
};

export const deleteBooking = async (req, res) => {
	const { id } = req.params;

	try {
		const booking = await Booking.findById(id);
		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		// Ensure that only the owner of the booking or the user who created the booking can delete it
		if (
			booking.owner.toString() !== req.userId.toString() &&
			booking.user.toString() !== req.userId.toString()
		) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		await Booking.findByIdAndDelete(id);
		const remainingBookings = await Booking.find({ room: booking.room });

		if (remainingBookings.length === 0) {
			// Update the room status to available
			const room = await Room.findById(booking.room);
			room.status = "available";
			await room.save();
		}
		res
			.status(200)
			.json({ success: true, message: "Booking deleted successfully" });
	} catch (error) {
		console.error("Error deleting booking:", error);
		res.status(500).json({
			success: false,
			message: "Failed to delete booking",
			error: error.message,
		});
	}
};

export const countBookingsByListing = async (req, res) => {
	const { listingId } = req.params;

	try {
		const count = await Booking.countDocuments({ room: listingId });

		if (count === 0) {
			return res.status(404).json({
				success: false,
				message: "No bookings found for this listing",
			});
		}

		res.status(200).json({ success: true, count });
	} catch (error) {
		console.error("Error counting bookings by listing:", error);
		res.status(500).json({
			success: false,
			message: "Failed to count bookings, something went wrong",
			error: error.message,
		});
	}
};