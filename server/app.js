import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { connect } from "./config/config.js";
import { chatModel } from "./models/chat.schema.js";
import { UserRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import path from "path";
const port = 3000;

const app = express();
const server = new createServer(app);

const io = new Server(server, {
    cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// app.options('*', cors());
// app.use(cors());
app.use(cookieParser());
// Manually set the CORS headers for each request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use('/auth', UserRouter);

io.on("connection", (socket) => {
    console.log("Connection established, socket id:", socket.id);    

    socket.on("message",  ({ message: message, username: userName_f }) => {
        io.emit("receive-message", ({ message: message, username: userName_f }));

        const newChat = new chatModel({
            username: userName_f,
            message: message,
            timestamp: new Date()
        });
        newChat.save();  
    })
    chatModel.find()
        .sort({ timestamp: 1 })
        .limit(50)
        .then((messages) => {
            socket.emit('load_messages', messages);
            console.log("Messages from database",messages);
        })
        .catch((err) => {
            console.log(err);
            });
            

    socket.on("disconnect", () => {
        console.log("Disconnected, socket id:", socket.id);
    });

    socket.emit("welcome", `Welcome to socket, ${socket.id}`);

});


server.listen(port, () => {
    console.log("Server is running on port 3000");
    connect();
});