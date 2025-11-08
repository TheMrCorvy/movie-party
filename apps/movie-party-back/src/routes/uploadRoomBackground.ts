import { Request, Response } from "express";
import {
    ServerRoom,
    Signals,
    BackgroundUpdatedWsCallbackParams,
} from "@repo/type-definitions/rooms";
import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export const uploadRoomBackground = (
    req: Request,
    res: Response,
    rooms: ServerRoom[],
    io: SocketIOServer
) => {
    try {
        const { roomId, peerId } = req.body;
        const imageFile = req.files?.image as UploadedFile;

        const { roomExists, room, peerIsParticipant } = roomValidation({
            rooms,
            roomId,
            peerShouldBeParticipant: true,
            peerId,
        });

        if (!roomId || !peerId || !imageFile) {
            return res.status(400).json({
                error: "Se requiere roomId, peerId y un archivo de imagen.",
            });
        }

        if (!roomExists || !room) {
            return res.status(404).json({
                error: "La sala no existe",
            });
        }

        if (!peerIsParticipant) {
            return res.status(403).json({
                error: "No tienes permiso para subir imágenes en esta sala.",
            });
        }

        if (!imageFile.mimetype.startsWith("image/")) {
            return res.status(400).json({
                error: "El archivo debe ser una imagen.",
            });
        }

        if (imageFile.size > 4 * 1024 * 1024) {
            return res.status(400).json({
                error: "La imagen no debe superar los 4MB.",
            });
        }

        const assetsDir = path.join(__dirname, "../assets");
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        const fileName = `${roomId}${path.extname(imageFile.name)}`;
        const filePath = path.join(assetsDir, fileName);

        imageFile.mv(filePath, (err: Error | null) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al guardar la imagen.",
                });
            }

            room.hasCustomBg = {
                isCssPattern: false,
                src: `/room-background/${roomId}`,
            };

            const callback: BackgroundUpdatedWsCallbackParams = {
                background: room.hasCustomBg,
            };

            io.in(roomId).emit(Signals.BACKGROUND_UPDATED, callback);

            res.status(200).json({
                message: "Imagen subida correctamente.",
                background: room.hasCustomBg,
            });
        });
    } catch (error) {
        console.error("Error en uploadRoomBackground:", error);
        res.status(500).json({
            error: "Error interno del servidor.",
        });
    }
};
