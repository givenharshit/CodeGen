import "dotenv/config.js";
import http from "node:http";
import { connectDB } from "./database/db.js";
import app from "./app.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import user from "./models/user.model.js";
import {Project} from "./models/project.model.js";
import * as ai from "./services/gemini.service.js";


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});



io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      console.error("Authentication Error: Token is missing");
      return next(new Error("Authentication Error: Token is missing"));
    }

    const projectId = socket.handshake.query?.projectId;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("Invalid ProjectId");
      return next(new Error("Invalid ProjectId"));
    }

    const projectInfo = await Project.findById(projectId);

    if (!projectInfo) {
      console.error("Project not found");
      return next(new Error("Project not found"));
    }

    socket.project = projectInfo;

    if (!token) {
      console.error("Authentication Error: Token is missing");
      return next(new Error("Authentication Error: Token is missing"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Authentication Error: Invalid or expired token: ", err);
      return next(
        new Error("Authentication Error: Invalid or expired token: ", err)
      );
    }

    socket.user = decoded;

    next();
  } catch (error) {
    console.log("Socket Authentication Error:", error);
    next(new Error("Server Error"));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("User connected to project:", socket.roomId);

  if (!socket.project) {
    console.error("Socket connection error: No project found");
    return;
  }

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    console.log(data);
    let { message, sender } = data;
    sender = await user.findOne({ _id: sender });
    socket.broadcast.to(socket.roomId).emit("project-message", data);
    
    const isAiInvolved = message.includes("@AI") || message.includes("@ai") || message.includes("@Ai");
    if (isAiInvolved) {
      const prompt = message.replace(/@AI|@ai|@Ai/g, "").trim();
      const response = await ai.generateContent(prompt);

      if (socket.roomId) {
        io.to(socket.roomId).emit("project-message", {
          message: response,
          sender: {
            _id: "ai",
            email: "gemini@ai",
          },
        });
      } else {
        console.error("Error: socket.roomId is undefined");
      }

      return;
    }

    data = {
      message: message,
      sender: sender.email,
    };
    
  });

  socket.on("disconnect", () => {
      console.log("User disconnected from project:", socket.roomId);
      socket.leave(socket.roomId);
  });
});

connectDB()
  .then(() => {
    try {
      app.on("Error", (err) => {
        console.error(`Error Occurred !! ${err}`);
        throw err;
      });

      server.listen(process.env.PORT || 3000, function () {
        console.log(`SERVER IS RUNNING AT PORT : ${process.env.PORT || 3000}`);
      });
    } catch (error) {
      console.log("SERVER START ERROR:", error);
    }
  })
  .catch((err) => {
    console.error(`MONGODB Connection FAILED: ${err}`);
  });
