import User from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import {validationResult} from "express-validator";
import redisClient from "../services/redis.service.js";


//! This function is called when the user wants to register
export const createUserController = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateToken();
        delete user._doc.password; // it removes the password from the response but it is not recommended to do so because it will be removed from the user object in the database as well and we will not be able to compare the password in the login route  
        // console.log(toObject(user).password);
        return res.status(201).json({user, token});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//! This route will be called when the user wants to login
export const loginUserController = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        if(!await user.isValidPassword(password)){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token = await user.generateToken();
        delete user._doc.password;
        return res.status(200).json({user, token});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//! This route will be called when the user wants to logout
export const logoutUserController = async function (req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        redisClient.set(token, "logout", "EX", 60 * 60 * 24);
        return res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//! This route will be called when the user wants to see his profile
export const profileUserController = async function (req, res) {
    try {
        return res.status(200).json({user: req.user});
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Compare this snippet from backend/services/user.service.js:

//! Get all Users from Database

export const getAllUsers = async(req, res) => {
    try {
        const loggedInUser = await User.findOne({email: req.user.email});

        const allUsers = await userService.getAllUsersById({userId : loggedInUser._id});
        return res.status(200).json(allUsers);
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}