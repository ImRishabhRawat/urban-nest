import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		phone: { type: Number },
		photo: { type: String },
		role: {
			type: String,
		},
		gender: { type: String, enum: ["male", "female"] },
		properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
		bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
		isApproved: {
			type: String,
			enum: ["pending", "approved", "cancelled"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Owner", OwnerSchema);