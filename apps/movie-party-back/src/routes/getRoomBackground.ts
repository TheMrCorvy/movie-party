import { Request, Response } from "express";
import { ServerRoom } from "@repo/type-definitions/rooms";
import path from "path";
import fs from "fs";
import roomValidation from "../utils/roomValidations";

export const getRoomBackground = (
    req: Request,
    res: Response,
    rooms: ServerRoom[]
) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).send({
            message: "Room ID is required",
            status: 400,
        });
    }

    const { roomExists, message } = roomValidation({ rooms, roomId });

    if (!roomExists) {
        return res.status(404).send({
            message: message,
            status: 404,
        });
    }

    const assetsPath = path.join(__dirname, "../assets");
    let imagePath = "";

    if (!fs.existsSync(assetsPath)) {
        return res.status(500).send({
            message: "Assets directory not found",
            status: 500,
        });
    }

    if (fs.existsSync(assetsPath)) {
        const files = fs.readdirSync(assetsPath);
        const match = files.find(
            (f) => f.startsWith(roomId + ".") || f === roomId
        );
        if (match) {
            imagePath = path.join(assetsPath, match);
        }
    }

    if (!imagePath || !fs.existsSync(imagePath)) {
        return res.status(404).send({
            message: "Background image not found",
            status: 404,
        });
    }

    const extension = path.extname(imagePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
    };

    const contentType = mimeTypes[extension] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    return res.sendFile(imagePath);
};
