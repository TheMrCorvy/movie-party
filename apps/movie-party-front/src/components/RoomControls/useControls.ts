import { PatternClass } from "@repo/type-definitions";
import { copyToClipboard } from "../../utils/accessUserHardware";
import { logData } from "@repo/shared-utils/log-data";
import {
    sendBackgroundPattern,
    uploadRoomBackground,
} from "../../services/roomBackgroundService";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { useRef } from "react";

const useControls = () => {
    const { room, ws } = useRoom();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await uploadRoomBackground({
                    file,
                    roomId: room.id,
                    peerId: room.myId,
                });
            } catch (error) {
                logData({
                    type: "error",
                    data: error,
                    timeStamp: true,
                    layer: "access_user_hardware",
                });
            }
        }
    };

    const handleReset = () => {
        sendBackgroundPattern({
            ws,
            roomId: room.id,
            peerId: room.myId,
            pattern: PatternClass.CUBES,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleCopy = async () => {
        const text =
            `${process.env.FRONTEND_BASE_PATH || "http://localhost:5173"}/join-room/` +
            room.id;
        await copyToClipboard({
            callback: (params) =>
                logData({
                    title: "Copied invitation",
                    data: params,
                    type: "info",
                    timeStamp: true,
                    layer: "access_user_hardware",
                }),
            text,
        });
    };

    const colSize = {
        md: 6,
        lg: 4,
        xl: 3,
    };

    return {
        colSize,
        handleCopy,
        handleButtonClick,
        handleReset,
        handleFileChange,
        fileInputRef,
        room,
    };
};

export default useControls;
