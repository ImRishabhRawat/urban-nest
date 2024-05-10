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
		const rooms = await Room.find({}).populate("owner", "-password"); // Exclude password field when populating owner
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