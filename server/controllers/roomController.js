import Booking from "../models/BookingSchema.js";
import Owner from "../models/OwnerSchema.js";
import Room from "../models/RoomSchema.js";

export const createRoom = async (req, res) => {
	const ownerId = req.userId;
	const {
		title,
		description,
		price,
		location,
		images,
		category,
		studentCount,
		roomCount,
		bathroomCount,
	} = req.body;

	try {
		const ownerRecord = await Owner.findById(ownerId);
		if (ownerRecord.isApproved !== "approved") {
			console.log("notApproved");
			return res.status(401).json({
				success: false,
				message: "Owner is not approved",
			});
		}
			console.log("Approved");

		const newRoom = new Room({
			title,
			description,
			price,
			location,
			images,
			owner: ownerRecord,
			category,
			studentCount,
			roomCount,
			bathroomCount,
		});

		const savedRoom = await newRoom.save();

		await Owner.findByIdAndUpdate(ownerId, {
			$push: { properties: savedRoom._id },
		});

		res.status(200).json({
			success: true,
			message: "Room listed successfully",
			data: savedRoom,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Room is not listing, Something went wrong",
		});
	}
};

export const getAllRooms = async (req, res) => {
	try {
		const rooms = await Room.find({})
			.populate("owner", "-password") // Exclude password field when populating owner
			.sort({ createdAt: -1 }); // Sort by createdAt in descending order

		res.status(200).json({
			success: true,
			data: rooms,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};



export const getSingleRoom = async (req, res) => {
	const { roomId } = req.params; // Get the room ID from the route parameter

	try {
		const room = await Room.findById(roomId).populate("owner", "-password");
		if (!room) {
			return res.status(404).json({
				success: false,
				message: "Room not found",
			});
		}
		res.status(200).json({
			success: true,
			data: room,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch the room",
		});
	}
};

export const getOwnerRooms = async (req, res) => {
	const ownerId = req.params.ownerId;

	try {
		const owner = await Owner.findById(ownerId);
		if (!owner) {
			return res.status(404).json({
				success: false,
				message: "Owner not found",
			});
		}

		const rooms = await Room.find({ owner: ownerId }).populate(
			"owner",
			"-password"
		);
		res.status(200).json({
			success: true,
			data: rooms,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch rooms",
		});
	}
};


export const getFilteredRooms = async (req, res) => {
	try {
		const {
			categories,
			locationValue,
			studentCount,
			roomCount,
			bathroomCount,
			startDate,
			endDate,
		} = req.query;

		const query = {};
		if (categories) {
			query.category = { $in: categories.split("+") };
		}
		if (locationValue) {
			query["location.value"] = locationValue;
		}
		if (studentCount) {
			query.studentCount = parseInt(studentCount);
		}
		if (roomCount) {
			query.roomCount = parseInt(roomCount);
		}
		if (bathroomCount) {
			query.bathroomCount = parseInt(bathroomCount);
		}

		let bookedRoomIds = [];
		if (startDate && endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);

			const bookings = await Booking.find({
				$or: [
					{
						"visitDates.startDate": { $lte: end },
						"visitDates.endDate": { $gte: start },
					},
					{ "visitDates.startDate": { $gte: start, $lte: end } },
					{ "visitDates.endDate": { $gte: start, $lte: end } },
				],
			});

			bookedRoomIds = bookings.map((booking) => booking.room);
			query._id = { $nin: bookedRoomIds };
		}

		const rooms = await Room.find(query);
		res.status(200).json({
			success: true,
			data: rooms,
		});
	} catch (error) {
		console.error("Error fetching filtered rooms:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
