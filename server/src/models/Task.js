import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "on-hold", "done"],
      default: "backlog"
    },
    assignedTo: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

taskSchema.set("toJSON", {
  transform: (_, doc) => {
    doc.id = doc._id.toString();
    doc.projectId = doc.projectId.toString();
    delete doc._id;
    delete doc.__v;
    return doc;
  }
});

export const Task = mongoose.model("Task", taskSchema);
