import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const questionsSchema = new Schema({
  questionId: { type: String, unique: true, required: true },
  questionText: { type: String },
  options: [{ type: String }],
  answer: { type: String },
});

export default mongoose.model("questions", questionsSchema);
