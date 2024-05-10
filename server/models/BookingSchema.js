import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			ref: "Owner",
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		room: {
			type: mongoose.Types.ObjectId,
			ref: "Room",
			required: true,
		},
		StartingDate: {type:Array},
		price: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "approved", "cancelled"],
			default: "pending",
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
