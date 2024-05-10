import User from "../models/UserSchema.js";
import Owner from "../models/OwnerSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
	return jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: "15d",
		}
	);
};

export const register = async (req, res) => {
	const { email, name, password, role } = req.body;

	try {
		let user = null;
		if (role === "student") {
			user = await User.findOne({ email });
		} else if (role === "owner") {
			user = await Owner.findOne({ email });
		}

		//if user exists
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		//hash password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		if (role === "student") {
			user = new User({
				name,
				email,
				password: hashPassword,
				role,
			});
		}

		if (role === "owner") {
			user = new Owner({
				name,
				email,
				password: hashPassword,
				role,
			});
		}

		await user.save();

		res
			.status(200)
			.json({ success: true, message: "user successfully created" });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error, Try again later",
		});
	}
};

export const login = async (req, res) => {
	const { email } = req.body;
	try {
		let user = null;

		const student = await User.findOne({ email });
		const owner = await Owner.findOne({ email });

		if (student) {
			user = student;
		}
		if (owner) {
			user = owner;
		}

		//check if user exist or not
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		//compare password
		const isPasswordMatched = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordMatched) {
			return res
				.status(404)
				.json({ status: false, message: "Invalid Credentials" });
		}

		const token = generateToken(user);

		const { password, role, ...rest } = user._doc;

		res.status(200).json({
			status: true,
			message: "Successfully login",
			token,
			data: { ...rest },
			role,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: false,
			message: "Failed to login",
		});
	}
};
