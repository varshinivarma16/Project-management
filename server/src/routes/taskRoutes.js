import { Router } from "express";
import { body } from "express-validator";
import { deleteTask, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty"),
    body("status")
      .optional()
      .isIn(["backlog", "todo", "in-progress", "on-hold", "done"])
      .withMessage("Invalid status")
  ],
  validate,
  updateTask
);
router.delete("/:id", deleteTask);

export default router;
