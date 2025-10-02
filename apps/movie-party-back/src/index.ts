import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import { roomHandler } from "./rooms";
import { logData } from "@repo/shared-utils/log-data";
import { ServerRoom } from "@repo/type-definitions/rooms";
import { stringIsEmpty } from "@repo/shared-utils";
import { verifyPassword } from "./utils/passwordVerification";
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
        layer: "*",
        timeStamp: true,
    });

    interface VerifyPasswordEndpointParams {
        password: string;
        roomId: string;
        peerId: string;
        peerName: string;
    }

    const reqBody = req.body as VerifyPasswordEndpointParams;

    if (
        stringIsEmpty(reqBody.password) ||
        stringIsEmpty(reqBody.roomId) ||
        stringIsEmpty(reqBody.peerId)
    ) {
        return res.status(400).send({
            message: "Data provided is invalid",
        });
    }

    const room = rooms.find((r) => r.id === reqBody.roomId);

    if (
        !room ||
        !room.password ||
        stringIsEmpty(room.password) ||
        stringIsEmpty(reqBody.peerName)
    ) {
        return res.status(400).send({
            message: "Data provided is invalid",
        });
    }

    const passwordIsCorrect = await verifyPassword(
        reqBody.password,
        room.password
    );

    if (!passwordIsCorrect) {
        return res.status(400).send({
            message: "Password is incorrect",
        });
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
