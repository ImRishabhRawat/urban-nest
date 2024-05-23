import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Owner",
			required: true,
		},
		room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
		price: { type: Number, required: true },
		visitDates: {
			startDate: { type: Date, required: true },
			endDate: { type: Date, required: true },
		},
		studentApproved: { type: Boolean, default: false },
		ownerApproved: { type: Boolean, default: false },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
