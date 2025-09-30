import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { roomHandler } from "./rooms";
import { logData } from "@repo/shared-utils/log-data";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello there!");
});

io.on("connection", (socket) => {
    logData({
        title: "A user connected",
        addSpaceAfter: true,
        layer: "*",
    });

    roomHandler(socket, io);
});

server.listen(port, () => {
    logData({
        layer: "*",
        title: "App is listening on port *",
        data: port,
        addSpaceAfter: true,
    });
});
