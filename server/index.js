import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import roomRoute from "./routes/room.js";
import authRoute from "./routes/auth.js";
import googleRoute from "./routes/googleAuth.js";
import userRoute from "./routes/user.js";
import bookingRoute from "./routes/booking.js";
import githubRoute from "./routes/githubAuth.js";
import ownerRoutes from "./routes/owner.js";
import "./passport.js";

dotenv.config();

const app = express();

app.use(
	session({
		secret: process.env.JWT_SECRET_KEY,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // Set to true if using https
	})
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 8000;

const corsOptions = {
	origin: process.env.CLIENT_SITE_URL || true,
	credentials: true,
};

app.get("/", (req, res) => {
	res.send("API is working");
});

// Database Connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connection established");
	} catch (error) {
		console.log(error);
	}
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/room", roomRoute);
app.use("/api/v1/github", githubRoute);
app.use("/api/v1/Oauth", googleRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/owners", ownerRoutes);

app.listen(port, () => {
	connectDB();
	console.log(`Server is listening on port ${port}`);
});
