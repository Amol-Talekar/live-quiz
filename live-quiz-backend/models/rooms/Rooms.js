import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  capacity: {
    type: Number,
    default: 2,
  },
});

export default mongoose.model("Room", roomSchema);
