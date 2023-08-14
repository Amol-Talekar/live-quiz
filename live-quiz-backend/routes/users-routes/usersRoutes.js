import Express from "express";
import {
  getAllUsers,
  login,
  signup,
} from "../../controllers/users-controllers/usersControllers.js";

const userRouter = Express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);

export default userRouter;
