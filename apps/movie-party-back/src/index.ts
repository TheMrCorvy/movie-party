import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import { roomHandler } from "./rooms";
import { logData } from "@repo/shared-utils/log-data";
import { ServerRoom } from "@repo/type-definitions/rooms";
import { stringIsEmpty } from "@repo/shared-utils";
import { hashPassword, verifyPassword } from "./utils/passwordVerification";
import { enterRoom } from "./rooms/enterRoom";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());

const rooms: ServerRoom[] = [];
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
let useSocket = null as null | Socket;

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello there!");
});

app.post("/room-password", async (req, res) => {
    logData({
        title: "Request Received",
        data: req.body,
        type: "info",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
    });

    interface VerifyPasswordEndpointParams {
        password?: string;
        roomId: string;
        peerId: string;
        peerName: string;
    }

    const reqBody = req.body as VerifyPasswordEndpointParams;

    if (
        stringIsEmpty(reqBody.roomId) ||
        stringIsEmpty(reqBody.peerId) ||
        stringIsEmpty(reqBody.peerName)
    ) {
        return res.status(400).send({
            message: "Data provided is invalid",
            status: 400,
        });
    }

    const room = rooms.find((r) => r.id === reqBody.roomId);

    if (!room) {
        return res.status(400).send({
            message: "Data provided is invalid",
            status: 400,
        });
    }

    if (room.password) {
        const passwordIsCorrect = await verifyPassword(
            reqBody.password || "",
            room.password
        );

        if (!passwordIsCorrect) {
            return res.status(400).send({
                message: "Password is incorrect",
                status: 400,
            });
        }
    }

    if (useSocket) {
        logData({
            title: "Validation was successful",
            layer: "room_ws",
            addSpaceAfter: true,
            timeStamp: true,
            type: "info",
            data: {
                roomId: reqBody.roomId,
                rooms,
                peerId: reqBody.peerId,
                peerName: reqBody.peerName,
            },
        });
        enterRoom({
            roomId: reqBody.roomId,
            rooms,
            peerId: reqBody.peerId,
            peerName: reqBody.peerName,
            socket: useSocket,
            io,
        });
    }

    return res.status(200).send({
        message: "Password is correct!",
        status: 200,
    });
});

app.patch("/room-password", async (req, res) => {
    logData({
        title: "Request Received",
        data: req.body,
        type: "info",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
    });

    interface UpdateRoomParams {
        password: string;
        roomId: string;
        peerId: string;
    }

    const reqBody = req.body as UpdateRoomParams;

    if (
        stringIsEmpty(reqBody.roomId) ||
        stringIsEmpty(reqBody.peerId) ||
        typeof reqBody.password !== "string"
    ) {
        return res.status(400).send({
            message: "Data provided is invalid",
            status: 400,
        });
    }

    const roomIndex = rooms.findIndex((r) => r.id === reqBody.roomId);

    if (roomIndex === -1 || rooms[roomIndex].roomOwner !== reqBody.peerId) {
        return res.status(400).send({
            message: "Data provided is invalid",
            status: 400,
        });
    }

    rooms[roomIndex].password = reqBody.password
        ? await hashPassword(reqBody.password)
        : "";

    return res.status(200).send({
        message: "Room password was updated successfuly!",
        status: 200,
        roomHasPassword: reqBody.password ? true : false,
    });
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
