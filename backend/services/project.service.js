import { Project } from "../models/project.model.js";
import mongoose from "mongoose";

const createProject = async ({ name, description, userId}) => {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    if (!userId) {
      throw new Error("User is required");
    }

    const ProjectRes = await Project.create({
      name,
      description,
      user: [userId],
    });
    return ProjectRes;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name is already taken");
    }
    throw error;
  }
};

const getAllProjectsByUserID = async ({userId}) => {
  try {
    if (!userId) {
      throw new Error("UserId is required");
    }
    const projects = await Project.find({ user: userId });
    return projects;
  } catch (error) {
    throw error;
  }
};

const addUserToProjectById = async ({ projectId, user, userId }) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project Id");
  }

  if (!user) {
    throw new Error("Users are required");
  }

  if (
    !Array.isArray(user) ||
    user.some(userId => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId in users array");
  }

  if (!userId) {
    throw new Error("Invalid userId");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const foundProject = await Project.findOne({
    _id: projectId,
    user: userId,
  });

  if (!foundProject) {
    throw new Error("User does not belong to this project");
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        user: {
          $each: user,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};


export const getProjectById = async({projectId}) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project Id");
  }

  const projectInfo = await Project.findOne({_id: projectId}).populate('user');

  return projectInfo;
}

export default {
  createProject,
  getAllProjectsByUserID,
  addUserToProjectById,
  getProjectById
};
