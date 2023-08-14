import { json } from "express";
import bcrypt from "bcryptjs";
import Users from "../../models/users/Users.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await Users.find();
    //console.log("users from getAllUsers => ", users);
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res.status(404).json({ message: "No Users Found" });
  }

  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await Users.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User Already Exits ! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const updatedOn = new Date();
  const user = new Users({
    name,
    email,
    password: hashedPassword,
    updatedOn,
  });

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }

  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  console.log("this is req.body in login ", req.body);
  try {
    existingUser = await Users.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "User could not be found by this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  // Generate a token
  const token = jwt.sign(
    {
      _id: existingUser._id,
      name: existingUser.name,
      email: email,
    },
    process.env.LIVE_QUIZ_SECRET_KEY,
    { expiresIn: "1d" }
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res.status(200).json({ message: "Login Successful", token: token });
};
