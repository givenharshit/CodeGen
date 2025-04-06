import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProject
);

router.get("/all", authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authUser,
  body("projectId").isString().withMessage("Project Id is Required"),
  body("user").isArray({min: 1}).withMessage("Users must be an array of strings").bail().custom((user) => user.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
  projectController.addUserToProject
);


router.get("/get-project/:projectId",
  authUser,
  projectController.getProjectInfo
)

export default router;
