import projectServices from "../services/project.service.js";
import {validationResult} from "express-validator";
import userModel from "../models/user.model.js";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { name, description } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const newProject = await projectServices.createProject({name, description, userId});
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const projects = await projectServices.getAllProjectsByUserID({userId: loggedInUser._id});
    res.status(200).json({projects: projects});
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

export const addUserToProject = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return res.status(400).json({message: errors.array()});
  }

  try {
    const {projectId, user} = req.body;
    const loggedInUser = await userModel.findOne({email: req.user.email});
  
    const getProject = await projectServices.addUserToProjectById({
      projectId,
      user,
      userId: loggedInUser._id
    });

    return res.status(200).json({
      getProject
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export const getProjectInfo = async(req, res) => {
  const {projectId} = req.params;

  try {
    const projectInfo = await projectServices.getProjectById({projectId});

    return res.status(200).json({
      projectInfo
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error.message});
  }
}