import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import roomRoute from './routes/room.js'
import authRoute from './routes/auth.js'
import cookieSession from "cookie-session";
import googleRoute from "./routes/googleAuth.js";
import './passport.js';  
import userRoute from "./routes/user.js";


dotenv.config();

const app = express();
app.use(cookieSession({
    name: "session",
    keys: ["Rishabh"],
    maxAge:24*60*60*100,
}))
app.use(passport.initialize());
app.use(passport.session());


const port = process.env.PORT || 8000;

const corsOptions = {
    origin: true,
    Credentials: true,
};

app.get("/", (req, res) => {
	res.send("API is working");
});

//database Connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connection established");
    } catch (error) { 
        console.log(error);
    }
}

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/room", roomRoute);
// app.use("/api/v1/",githubRoute)
app.use("/api/v1/Oauth", googleRoute);
app.use("/api/v1/user", userRoute);



app.listen(port, ()=>{
    connectDB();
    console.log("Server is listening on port " + port);
});