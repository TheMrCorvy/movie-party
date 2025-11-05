import type { Socket, Server as SocketIOServer } from "socket.io";
import {
    Signals,
    Room,
    LeaveRoomWsParams,
    UpdateParticipantsWsCallback,
    PollUpdatedWsParams,
    MessageReceivedWsCallbackParams,
} from "@repo/type-definitions/rooms";
import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex, Poll } from "@repo/type-definitions";
import { generateId } from "@repo/shared-utils";
import path from "path";
import fs from "fs";

export interface LeaveRoomParams extends LeaveRoomWsParams {
    rooms: Room[];
    io: SocketIOServer;
    socket: Socket;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io, socket }) => {
    const room = rooms.find((room) => room.id === roomId);
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    if (!room || roomIndex === -1) {
        logData({
            title: "User tryed to leave from a non existing room",
            type: "error",
            layer: "*",
            data: {
                room,
                params: {
                    peerId,
                    roomId,
                    rooms,
                },
            },
            addSpaceAfter: true,
            timeStamp: true,
        });
        return;
    }

    const peerName =
        room.participants.find((peer) => peer.id === peerId)?.name || "Mr. X";

    room.participants = room.participants.filter(
        (participant) => participant.id !== peerId
    );

    if (room.participants.length === 0) {
        try {
            const bg = room.hasCustomBg;
            if (bg && !bg.isCssPattern) {
                const assetsPath = path.join(__dirname, "../assets");
                if (fs.existsSync(assetsPath)) {
                    const files = fs.readdirSync(assetsPath);
                    const match = files.find(
                        (f) => f.startsWith(roomId + ".") || f === roomId
                    );
                    if (match) {
                        const fileToDelete = path.join(assetsPath, match);
                        try {
                            fs.unlinkSync(fileToDelete);
                            logData({
                                title: "Deleted room background image from disk",
                                layer: "room_ws",
                                type: "info",
                                timeStamp: true,
                                addSpaceAfter: true,
                                data: fileToDelete,
                            });
                        } catch (err) {
                            logData({
                                title: "Failed to delete room background image",
                                layer: "room_ws",
                                type: "error",
                                timeStamp: true,
                                addSpaceAfter: true,
                                data: { err, file: fileToDelete },
                            });
                        }
                    }
                }
            }
        } catch (err) {
            logData({
                title: "Error while trying to remove room background",
                layer: "room_ws",
                type: "error",
                timeStamp: true,
                addSpaceAfter: true,
                data: err,
            });
        }

        if (roomIndex !== -1) {
            rooms.splice(roomIndex, 1);
        } else {
            const idx = rooms.findIndex((r) => r.id === roomId);
            if (idx !== -1) rooms.splice(idx, 1);
        }

        logData({
            title: "Deleted empty room",
            layer: "room_ws",
            type: "info",
            timeStamp: true,
            addSpaceAfter: true,
            data: {
                roomId,
                peerId,
            },
        });

        return;
    }

    logData({
        title: "Emitting get participants",
        layer: "participants_update",
        addSpaceAfter: true,
        timeStamp: true,
        data: {
            room,
            payload: {
                roomId,
                participants: room.participants,
                messages: room.messages,
                peerSharingScreen: room.peerSharingScreen,
            },
        },
        type: "info",
    });
    const getParticipantsCallback: UpdateParticipantsWsCallback = {
        roomId,
        participants: room.participants,
        messages: room.messages,
        peerSharingScreen: room.peerSharingScreen,
    };
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, getParticipantsCallback);

    const newMessage: MessageWithIndex = {
        peerId,
        peerName,
        id: generateId(),
        index: room.messages.length - 1,
        message: peerName + " ha abandonado la sala de conferencias.",
    };

    rooms[roomIndex].messages.push(newMessage);
    const callbackParams: MessageReceivedWsCallbackParams = {
        messageReceived: newMessage,
    };

    io.emit(Signals.MESSAGE_RECEIVED, callbackParams);

    logData({
        title: "User left",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
        type: "info",
        data: {
            roomId,
            peerId,
        },
    });

    let emitPollUpdate = false;
    let updatedPoll: Poll | undefined = undefined;

    room.messages.map((message, i) => {
        if (
            message.isPoll &&
            message.poll &&
            message.poll.status === "live" &&
            message.poll.amountOfVotes >= room.participants.length
        ) {
            const newMessage = {
                ...message,
                poll: {
                    ...message.poll,
                    status: "ended",
                },
            };
            emitPollUpdate = true;
            updatedPoll = newMessage.poll as Poll;
            room.messages[i] = newMessage as MessageWithIndex;
        }
    });

    if (emitPollUpdate && updatedPoll) {
        io.in(roomId).emit(Signals.POLL_UPDATED, {
            poll: updatedPoll,
        } as PollUpdatedWsParams);
    }

    socket.leave(roomId);
};
