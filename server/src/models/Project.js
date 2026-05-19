import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

projectSchema.set("toJSON", {
  transform: (_, doc) => {
    doc.id = doc._id.toString();
    doc.createdAt = doc.createdAt;
    delete doc._id;
    delete doc.__v;
    delete doc.owner;
    delete doc.updatedAt;
    return doc;
  }
});

export const Project = mongoose.model("Project", projectSchema);
