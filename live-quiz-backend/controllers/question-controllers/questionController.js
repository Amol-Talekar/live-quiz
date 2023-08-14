import Questions from "../../models/questions/Questions.js";

export const getAllQuestions = async (req, res, next) => {
  let questions;

  try {
    questions = await Questions.find();
    //console.log("questions from getAllquestions => ", questions);
  } catch (err) {
    console.log(err);
  }

  if (!questions) {
    return res.status(404).json({ message: "No questions Found" });
  }

  return res.status(200).json({ questions });
};

export const createQuestion = async (req, res, next) => {
  if (!req.body.questionText || !req.body.answer || !req.body.options) {
    res.status(400).send("Bad request");
    return;
  }
  console.log("this is body of req in create Question => ", req.body);

  let question = new Questions({
    questionId: req.body.questionId,
    questionText: req.body.questionText,
    answer: req.body.answer,
    options: req.body.options,
  });

  try {
    await question.save();
  } catch (err) {
    console.log(err);
    return err;
  }

  return res.status(201).json({ question });
};
