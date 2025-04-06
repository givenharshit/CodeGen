import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

//! This route will be called when the user wants to register
// If there is any wrong in the request, the middleware will return an array of errors from the file user.controller.js
// If there is no error, the middleware will call the function createUserController from the file auth.middleware.js
router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage("Password must be between 6 to 32 characters"),
  UserController.createUserController
);

//! This route will be called when the user wants to login
// If there is any wrong in the request, the middleware will return an array of errors from the file user.controller.js
// If there is no error, the middleware will call the function loginUserController from the file user.controller.js
router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage("Password must be between 6 to 32 characters"),
  UserController.loginUserController
);

//! This route will be called when the user wants to get his profile
// If there is no error, the middleware will call the function profileUserController from the file user.controller.js
router.get("/profile", authUser, UserController.profileUserController);

//! This route will be called when the user wants to logout
// If there is no error, the middleware will call the function logoutUserController from the file user.controller.js
router.get("/logout", 
    authUser,
    UserController.logoutUserController);


//! Get all users from Database

router.get(
  "/all",
  authUser,
  UserController.getAllUsers
)

    
export default router;