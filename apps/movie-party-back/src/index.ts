import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import fileUpload from "express-fileupload";
import { roomHandler } from "./rooms";
import { logData } from "@repo/shared-utils/log-data";
import { ServerRoom } from "@repo/type-definitions/rooms";
import { updateRoomPassword } from "./routes/updateRoomPassword";
import { verifyRoomPassword } from "./routes/verifyRoomPassword";
import { getRoomBackground } from "./routes/getRoomBackground";
import { uploadRoomBackground } from "./routes/uploadRoomBackground";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(
    fileUpload({
        limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max-file-size
        abortOnLimit: true,
    })
);

const rooms: ServerRoom[] = [];
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
let useSocket = null as null | Socket;
const port = process.env.PORT || 4000;

app.get("/health-check", (req, res) => {
    res.send("Server is running!");
});

app.post("/room-password", (req, res) => {
    verifyRoomPassword(req, res, rooms, useSocket, io);
});

app.patch("/room-password", (req, res) => {
    updateRoomPassword(req, res, rooms);
});

app.get("/room-background/:roomId", (req, res) => {
    getRoomBackground(req, res, rooms);
});

app.post("/room-background", (req, res) => {
    uploadRoomBackground(req, res, rooms, io);
});

io.on("connection", (socket) => {
    logData({
        title: "A user connected",
        addSpaceAfter: true,
        layer: "*",
    });

    useSocket = socket;

    roomHandler({ socket, io, rooms });
});

server.listen(port, () => {
    logData({
        layer: "*",
        title: "App is listening on port *",
        data: port,
        addSpaceAfter: true,
    });
});
