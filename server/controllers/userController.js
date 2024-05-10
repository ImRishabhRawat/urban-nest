	import Booking from "../models/BookingSchema.js";
	import Owner from "../models/OwnerSchema.js";
	import User from "../models/UserSchema.js";

	export const updateUser = async (req, res) => {
		const id = req.params.id;

		try {
			const updateUser = await User.findByIdAndUpdate(
				id,
				{ $set: req.body },
				{ new: true }
			);
			res.status(200).json({
				success: true,
				message: "Successfully updated",
				data: updateUser,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				message: "Failed to update",
			});
		}
	};

	export const deleteUser = async (req, res) => {
		const id = req.params.id;

		try {
			await User.findByIdAndDelete(id);
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

	export const getUserProfile = async (req, res) => {
		const userid = req.userId;
		// console.log(userid);
		try {
			const user = await User.findById(userid);

			if (!user) {
				return res
					.status(404)
					.json({ success: false, message: "User not found" });
			}

			const { password, ...rest } = user._doc;

			res.status(200).json({
				success: true,
				message: "Profile data is found",
				data: { ...rest },
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: "Something went wrong" });
		}
	};

	export const addFavorite = async (req, res) => {
		const { id, listingId } = req.params;

		try {
			const user = await User.findById(id);
			if (!user.favoriteIds.includes(listingId)) {
				user.favoriteIds.push(listingId);
				await user.save();
			}

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

	export const removeFavorite = async (req, res) => {
		const { id, listingId } = req.params;

		try {
			const user = await User.findById(id);
			const index = user.favoriteIds.indexOf(listingId);
			if (index > -1) {
				user.favoriteIds.splice(index, 1);
				await user.save();
			}

			res.status(200).json({
				success: true,
				message: "Successfully removed from favorites",
				data: user,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				message: "Failed to remove from favorites",
			});
		}
	};

