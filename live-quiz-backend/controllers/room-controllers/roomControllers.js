// Import the room model and socket.io

import { io } from "../../app.js";

import Room from "../../models/rooms/Rooms.js";

export const getRoomNames = async (req, res, next) => {
  const rooms = await Room.find();

  if (!rooms) {
    return res.status(400).json({ message: "There are no rooms" });
  }

  return res.status(200).json({ rooms });
};

export const emitRooms = (req, res, next) => {
  getRoomNames(req, res, next)
    .then((rooms) => {
      io.emit("rooms", rooms);
    })

    .catch((error) => {
      console.error(error);

      io.emit("error", error);
    });
};

export const getEmitRooms = async () => {
  const rooms = await Room.find();
  if (rooms) {
    io.emit("allrooms", rooms);
  } else {
    io.emit("error", "No Rooms Avaliable");
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log("body from create room ==> ", req.body);
    console.log("room name from create room ==> ", name);

    const existingRoom = await Room.findOne({ name });

    const newRoom = new Room({
      name,
      users: [req.user._id],
    });

    await newRoom.save();

    io.emit("roomCreated", newRoom);

    io.emit("roomId", newRoom._id);

    getEmitRooms();
  } catch (error) {
    console.error(error);
    //return res.status(500).json({ message: "Something went wrong" });
  }
};

export const joinRoom = async (data) => {
  try {
    const { name } = data;

    const existingRoom = await Room.findOne({ name }).populate("users");

    existingRoom.users.push(req.user._id);

    await existingRoom.save();

    io.emit("roomJoined", existingRoom, req.user);

    io.to(req.user._id).emit("roomId", existingRoom._id);
    getEmitRooms();
  } catch (error) {
    console.error(error);
    //return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const room = await Room.findById(roomId).populate("users");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ room });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
