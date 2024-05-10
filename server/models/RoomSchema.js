import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	location: { type: Object, required: true },
	images: [String],
	category: [String],
	studentCount: { type: Number},
	roomCount: { type: Number },
	bathroomCount: { type: Number },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

export default mongoose.model("Room", RoomSchema);