import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log("Server is listening....")
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Connection established on socket");
    ws.on("message", (data) => {
        console.log("message from client %s", data);

        ws.send("thanks buddy!!");
    });
});

