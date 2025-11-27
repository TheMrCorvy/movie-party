import { PatternClass } from "@repo/type-definitions";
import { logData } from "@repo/shared-utils/log-data";
import {
    sendBackgroundPattern,
    uploadRoomBackground,
} from "../../services/roomBackgroundService";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { useRef } from "react";
import { useGlassToast } from "../../context/GlassToastContext";

const useControls = () => {
    const { room, ws } = useRoom();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { dispatch } = useGlassToast();

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
                dispatch({
                    type: "SHOW_TOAST",
                    payload: {
                        message:
                            "Hubo un error al intentar subir la imagen. Verifique que esta no pese más de 4mb.",
                        severity: "error",
                    },
                });
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

    return {
        handleButtonClick,
        handleReset,
        handleFileChange,
        fileInputRef,
        room,
    };
};

export default useControls;
