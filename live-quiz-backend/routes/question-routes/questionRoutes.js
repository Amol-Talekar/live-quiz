import Express from "express";
import {
  createQuestion,
  getAllQuestions,
} from "../../controllers/question-controllers/questionController.js";

const questionRouter = Express.Router();

questionRouter.get("/", getAllQuestions);
questionRouter.post("/create", createQuestion);

export default questionRouter;
