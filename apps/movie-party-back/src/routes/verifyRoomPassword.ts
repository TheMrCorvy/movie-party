import { Request, Response } from "express";
import { Server } from "socket.io";
import { logData } from "@repo/shared-utils/log-data";
import { ServerRoom } from "@repo/type-definitions/rooms";
import { stringIsEmpty } from "@repo/shared-utils";
import { verifyPassword } from "../utils/passwordVerification";
import { enterRoom } from "../rooms/enterRoom";
import { Socket } from "socket.io";

interface VerifyPasswordEndpointParams {
    password?: string;
    roomId: string;
    peerId: string;
    peerName: string;
}

export const verifyRoomPassword = (
    req: Request,
    res: Response,
    rooms: ServerRoom[],
    useSocket: Socket | null,
    io: Server
) => {
    logData({
        title: "Request Received",
        data: req.body,
        type: "info",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
    });

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
        const passwordIsCorrect = verifyPassword(
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
};
