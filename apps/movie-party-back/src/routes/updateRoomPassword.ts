import { Request, Response } from "express";
import { logData } from "@repo/shared-utils/log-data";
import { ServerRoom } from "@repo/type-definitions/rooms";
import { stringIsEmpty } from "@repo/shared-utils";
import { hashPassword } from "../utils/passwordVerification";
import roomValidation from "../utils/roomValidations";

interface UpdateRoomParams {
    password: string;
    roomId: string;
    peerId: string;
}

export const updateRoomPassword = async (
    req: Request,
    res: Response,
    rooms: ServerRoom[]
) => {
    logData({
        title: "Request Received",
        data: req.body,
        type: "info",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
    });

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

    const { roomExists, roomIndex, peerIsOwner } = roomValidation({
        rooms,
        roomId: reqBody.roomId,
        peerShouldBeParticipant: true,
        peerId: reqBody.peerId,
    });

    if (!roomExists || roomIndex === -1 || !peerIsOwner) {
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
};
