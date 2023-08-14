import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  points: {
    type: Number,
    default: 0,
  },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  addedOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date },
});

export default mongoose.model("users", userSchema);
