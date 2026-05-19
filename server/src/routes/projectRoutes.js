import { Router } from "express";
import { body } from "express-validator";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { createTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);

router.get("/", getProjects);
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("description").trim().notEmpty().withMessage("Project description is required")
  ],
  validate,
  createProject
);
router.get("/:id", getProjectById);
router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Project name cannot be empty"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project description cannot be empty")
  ],
  validate,
  updateProject
);
router.delete("/:id", deleteProject);
router.post(
  "/:id/tasks",
  [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("status")
      .optional()
      .isIn(["backlog", "todo", "in-progress", "on-hold", "done"])
      .withMessage("Invalid status")
  ],
  validate,
  createTask
);

export default router;
