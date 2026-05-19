import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

const ensureProjectAccess = async (projectId, ownerId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  return Project.findOne({ _id: projectId, owner: ownerId });
};

export const getProjects = async (req, res) => {
  const projects = await Project.aggregate([
    { $match: { owner: req.user._id } },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectId",
        as: "tasks"
      }
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: 1,
        description: 1,
        createdAt: 1,
        taskCount: { $size: "$tasks" }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res.json(projects);
};

export const createProject = async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id
  });

  return res.status(201).json({ ...project.toJSON(), taskCount: 0 });
};

export const getProjectById = async (req, res) => {
  const project = await ensureProjectAccess(req.params.id, req.user._id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const tasks = await Task.find({ projectId: project._id }).sort({ createdAt: -1 });

  return res.json({
    ...project.toJSON(),
    tasks: tasks.map((task) => task.toJSON())
  });
};

export const updateProject = async (req, res) => {
  const project = await ensureProjectAccess(req.params.id, req.user._id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.name = req.body.name ?? project.name;
  project.description = req.body.description ?? project.description;
  await project.save();

  const taskCount = await Task.countDocuments({ projectId: project._id });

  return res.json({ ...project.toJSON(), taskCount });
};

export const deleteProject = async (req, res) => {
  const project = await ensureProjectAccess(req.params.id, req.user._id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();

  return res.json({ message: "Project deleted" });
};
