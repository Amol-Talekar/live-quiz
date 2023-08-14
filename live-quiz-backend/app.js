import Express from "express";

import "./initDB.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

import questionRouter from "./routes/question-routes/questionRoutes.js";
import userRouter from "./routes/users-routes/usersRoutes.js";
import roomRouter from "./routes/room-routes/roomRoutes.js";
import Room from "./models/rooms/Rooms.js";
import {
  emitRooms,
  getEmitRooms,
  getRoomNames,
  joinRoom,
} from "./controllers/room-controllers/roomControllers.js";
import Questions from "./models/questions/Questions.js";

const app = Express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // This is your client's origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors());
// app.use(bodyParser());

app.use("/questions", questionRouter);
app.use("/user", userRouter);
app.use("/room", roomRouter);

app.use("/", (req, res, next) => {
  res.send("Welcome to Live Quiz");
});

server.listen(8020);
console.log("Hello World");

//Listen for the connection event on the io instance

io.on("connection", (socket) => {
  // Log the socket id
  console.log("A user connected with id: " + socket.id);

  // Emit a 'rooms' event to the socket with the latest list of rooms
  socket.emit("allrooms", getEmitRooms()); // This is the line you need to add

  // Listen for the createRoom event on the socket
  socket.on("createRoom", (data) => {
    // Create a new room with the data
    createRoom(data, (err, room) => {
      if (err) {
        // Emit an error event to the socket if there is an error
        socket.emit("error", err);
      } else {
        // Emit a roomCreated event to the socket with the new room
        socket.emit("roomCreated", room);
        // Emit a rooms event to all sockets with the latest list of rooms
        socket.emit("allrooms", getEmitRooms());
      }
    });
  });

  // Listen for the joinRoom event on the socket
  socket.on("joinRoom", async (data) => {
    try {
      // Find the room by name
      console.log("data from joinRoom in app.js => ", data);
      const existingRoom = await Room.findOne({ name: data.name });
      console.log("existingRoom from joinRoom in app.js => ", existingRoom);
      console.log("this is data from joinRoom ================> ", data);

      const { _id } = data;
      console.log(
        "this is  _id from socket.handshake.query ======================> ",
        _id
      );

      if (!existingRoom) {
        // Emit an error event to the socket
        socket.emit("error", { message: "No room with this name found" });
        return;
      }

      // Check if the room is full
      if (existingRoom.users.length >= existingRoom.capacity) {
        // Emit an error event to the socket
        socket.emit("error", { message: "This room is full" });
        return;
      }

      // Check if the user is already in the room
      if (existingRoom.users.includes(socket.id)) {
        // Emit an error event to the socket
        socket.emit("error", { message: "You are already in this room" });
        return;
      }

      // Add the socket to the room
      socket.join(existingRoom._id);

      // Emit a 'roomJoined' event to the socket with the updated room data and the user data
      io.to(existingRoom._id).emit("roomJoined", existingRoom, socket.id);

      // Add the socket id to the room's user array
      if (_id != undefined) {
        existingRoom.users.push(_id);
        // Save the updated room to the database
        await existingRoom.save();
      }

      io.to(existingRoom._id).emit("userJoined", { _id: _id });

      // Emit a 'roomId' event to the socket so the client can listen for it
      socket.emit("roomId", existingRoom._id);

      // Emit an 'allrooms' event with updated room list to all clients
      io.emit("allrooms", await getEmitRooms());
    } catch (error) {
      // Handle any errors
      console.error(error);
      // Emit an error event to the socket
      socket.emit("error", { message: "Something went wrong" });
    }
  });

  // Listen for the "userReady" event from the client
  socket.on("userReady", (roomId, userId) => {
    // Emit a "userIsReady" event to all clients in the room
    io.to(roomId).emit("userIsReady", userId);
  });

  socket.on("startQuiz", async (roomId) => {
    try {
      // Fetch 5 random questions from the database
      const randomQuestions = await Questions.aggregate([
        { $sample: { size: 5 } },
      ]);

      console.log(" randomQuestions => ", randomQuestions);

      if (randomQuestions.length !== 5) {
        // Handle the case where you couldn't fetch 5 random questions
        socket.emit("error", {
          message: "Could not fetch enough questions for the quiz",
        });
        return;
      }

      // Emit the "quizStarted" event to both users
      io.to(roomId).emit("quizStarted");

      // Emit the "newQuestions" event to both users with the selected questions
      io.to(roomId).emit("newQuestions", randomQuestions);

      // Start a timer for the entire quiz duration (50 seconds)
      setTimeout(async () => {
        // Calculate and send the results to both users
        // const userAnswersMap = await getUsersAnswersMap(roomId); // Implement this function
        // const quizResults = calculateQuizResults(
        //   randomQuestions,
        //   userAnswersMap
        // );

        io.to(roomId).emit("quizFinished", "Quiz Ended");
      }, 50000); // 50 seconds
    } catch (error) {
      console.error("Error starting quiz:", error);
      socket.emit("error", { message: "Error starting quiz" });
    }
  });

  socket.on("submitAnswers", (roomId, userAnswers) => {
    // Store the user's answers in your backend (e.g., in-memory storage, database)
    saveUserAnswers(roomId, socket.id, userAnswers);
  });

  // Listen for the disconnect event on the socket
  socket.on("disconnect", () => {
    // Log the socket id
    console.log("A user disconnected with id: " + socket.id);
  });
});
