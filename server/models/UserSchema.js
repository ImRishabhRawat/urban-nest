import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: {
			type: String,
			required: function () {
				return !this.oauthProvider;
			},
		},
		name: { type: String, required: true },
		phone: { type: Number },
		photo: { type: String },
		role: {
			type: String,
			enum: ["student", "owner"],
			default: "student",
		},
		gender: { type: String, enum: ["male", "female"] },
		college: { type: String },
		location: { type: String },
		favoriteIds: { type: [String] },
		bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
		oauthProvider: { type: String }, // Add this field to track OAuth providers
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
