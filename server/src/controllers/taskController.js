import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

const findOwnedProject = async (projectId, ownerId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  return Project.findOne({ _id: projectId, owner: ownerId });
};

const findOwnedTask = async (taskId, ownerId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return null;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const project = await Project.findOne({ _id: task.projectId, owner: ownerId });
  return project ? task : null;
};

export const createTask = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user._id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const task = await Task.create({
    projectId: project._id,
    title: req.body.title,
    description: req.body.description ?? "",
    status: req.body.status ?? "todo",
    assignedTo: req.body.assignedTo ?? ""
  });

  return res.status(201).json(task.toJSON());
};

export const updateTask = async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.status = req.body.status ?? task.status;
  task.assignedTo = req.body.assignedTo ?? task.assignedTo;
  await task.save();

  return res.json(task.toJSON());
};

export const deleteTask = async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();

  return res.json({ message: "Task deleted" });
};
