import jwt from "jsonwebtoken";
import Owner from "../models/OwnerSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
	//get token from headers
	const authToken = req.headers.authorization;

	if (!authToken || !authToken.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ success: false, message: "No token, authorization denied" });
	}
	try {
		const token = authToken.split(" ")[1];

		//verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userId = decoded.id;
		req.role = decoded.role;

		// Fetch user data and attach to request
		let user = await User.findById(req.userId);
		if (!user) {
			user = await Owner.findById(req.userId);
		}

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		if (error.name === "TokenExpiredError") {
			return res.json({ message: "Token is expired" });
		}

		return res.status(401).json({ success: false, message: "Invalid token" });
	}
};

export const restrict = (roles) => async (req, res, next) => {
	const userId = req.userId;
	let user;

	try {
		const student = await User.findById(userId);
		const owner = await Owner.findById(userId);

		if (student) {
			user = student;
		}
		if (owner) {
			user = owner;
		}

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (!roles.includes(user.role)) {
			return res
				.status(401)
				.json({ success: false, message: "You are not authorized" });
		}

		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
