import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "Project name is already taken"],
    lowercase: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const Project = mongoose.model("Project", projectSchema);