import Booking from "../models/BookingSchema.js";
import Owner from "../models/OwnerSchema.js";
import User from "../models/UserSchema.js";
import Room from "../models/RoomSchema.js	"

export const deleteUser = async (req, res) => {
	const id = req.params.id;

	try {
		if (req.role === "student") {
			await User.findByIdAndDelete(id);
		} else if (req.role === "owner") {
			await Owner.findByIdAndDelete(id);
		}

		res.status(200).json({
			success: true,
			message: "Successfully deleted",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Failed to delete",
		});
	}
};

export const getSingleUser = async (req, res) => {
	const id = req.params.id;

	try {
		const user = await User.findById(id).select("-password");
		res.status(200).json({
			success: true,
			message: "User Found",
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({
			success: false,
			message: "User Not Found",
		});
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}).select("-password");
		res.status(200).json({
			success: true,
			message: "Users Found",
			data: users,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({
			success: false,
			message: "Users Not Found",
		});
	}
};

export const addFavorite = async (req, res) => {
	const { userId, listingId } = req.params;
	try {
		if (!userId) {
			throw new Error("You are not logged in");
		}
		const currentUser = await User.findById(userId);
		if (!listingId) {
			throw new Error("Invalid ID");
		}

		// Prevent adding duplicate favorite IDs
		let favoriteIds = new Set(currentUser.favoriteIds || []);
		favoriteIds.add(listingId);

		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: { favoriteIds: Array.from(favoriteIds) } }, // Correctly target the 'favoriteIds' field
			{ new: true }
		);
		res.status(200).json({
			success: true,
			message: "Successfully added to favorites",
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Failed to add to favorites",
		});
	}
};

// API to remove a favorite listing from a user's favorites
export const removeFavorite = async (req, res) => {
	const { userId, listingId } = req.params;
	try {
		if (!userId) {
			throw new Error("You are not logged in");
		}
		if (!listingId) {
			throw new Error("Invalid ID");
		}
		const currentUser = await User.findById(userId);

		let favoriteIds = currentUser.favoriteIds || [];
		favoriteIds = favoriteIds.filter((id) => id !== listingId); // Remove the ID from favorites

		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: { favoriteIds: favoriteIds } }, // Correctly target the 'favoriteIds' field
			{ new: true }
		);
		res.status(200).json({
			success: true,
			message: "Successfully removed from favorites",
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Failed to remove",
		});
	}
};

export const getFavorites = async (req, res) => {
	try {
		const userId = req.params.userId;
		const user = await User.findById(userId).populate({
			path: "favoriteIds",
			model: "Room",
			select:
				"title description price location images owner category studentCount roomCount bathroomCount",
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({ data: user.favoriteIds });
	} catch (error) {
		console.error("Error fetching favorites:", error);
		res
			.status(500)
			.json({ error: "Internal server error", details: error.message });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		let user;
		if (req.role === "student") {
			user = await User.findById(req.userId);
		} else if (req.role === "owner") {
			user = await Owner.findById(req.userId);
		}

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch profile, something went wrong",
			error: error.message,
		});
	}
};

// Update user profile
export const updateUserProfile = async (req, res) => {
	try {
		let user;
		if (req.role === "student") {
			user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
		} else if (req.role === "owner") {
			user = await Owner.findByIdAndUpdate(req.userId, req.body, { new: true });
		}

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update profile, something went wrong",
			error: error.message,
		});
	}
};