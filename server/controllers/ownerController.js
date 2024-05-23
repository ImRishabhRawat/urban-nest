import Owner from "../models/OwnerSchema.js";

export const getOwnerProfile = async (req, res) => {
	try {
		const owner = await Owner.findById(req.userId)
			.select("-password")
			.populate({
				path: "properties",
				model: "Room",
				select: "title description price location images category",
			});

		if (!owner) {
			return res.status(404).json({
				success: false,
				message: "Owner not found",
			});
		}

		res.status(200).json({
			success: true,
			data: owner,
		});
	} catch (error) {
		console.error("Error fetching owner profile:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch profile, something went wrong",
			error: error.message,
		});
	}
};

export const updateOwnerProfile = async (req, res) => {
	try {
		const updatedOwner = await Owner.findByIdAndUpdate(req.userId, req.body, {
			new: true,
		});

		if (!updatedOwner) {
			return res.status(404).json({
				success: false,
				message: "Owner not found",
			});
		}

		res.status(200).json({
			success: true,
			data: updatedOwner,
		});
	} catch (error) {
		console.error("Error updating owner profile:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update profile, something went wrong",
			error: error.message,
		});
	}
};

export const deleteOwner = async (req, res) => {
	try {
		const ownerId = req.params.id;
		await Owner.findByIdAndDelete(ownerId);

		res.status(200).json({
			success: true,
			message: "Owner account deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting owner account:", error);
		res.status(500).json({
			success: false,
			message: "Failed to delete owner account",
			error: error.message,
		});
	}
};
