import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.mjs";

const router = express.Router();

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").delete(deleteTodo).put(updateTodo);

export default router;
