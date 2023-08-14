import express from "express";
const roomRouter = express.Router();
import {
  createRoom,
  getRoomById,
  getRoomNames,
  joinRoom,
} from "../../controllers/room-controllers/roomControllers.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

roomRouter.post("/create", isAuthenticated, createRoom);

roomRouter.get("/", isAuthenticated, getRoomNames);
roomRouter.get("/:roomId", isAuthenticated, getRoomById);

roomRouter.post("/join", isAuthenticated, joinRoom);

export default roomRouter;
