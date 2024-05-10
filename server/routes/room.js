import express from "express";
import { createRoom, getAllRooms } from "../controllers/roomController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, restrict(["owner"]), createRoom)
  .get(getAllRooms); 

export default router;
