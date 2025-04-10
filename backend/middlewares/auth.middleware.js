import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this route" });
    }

    const isBlacklistToken = await redisClient.get(token);
    if (isBlacklistToken) {
      res.cookie("token", "");
      return res.status(401).send({ error: "UnAuthorized User" });
    }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    // next();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Authentication Error: Invalid or expired token: ", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "UNAUTHORIZED CATCH !!" });
  }
};
