import { FormEvent, useState } from "react";
import { logData } from "@repo/shared-utils/log-data";
import { RoomPasswordCallbackParams } from "@repo/type-definitions/rooms";

export interface UseRoomPasswordUpdateParams {
    initialPassword?: string;
    roomId: string;
    peerId: string;
}

export const useRoomPasswordUpdate = ({
    initialPassword,
    roomId,
    peerId,
}: UseRoomPasswordUpdateParams) => {
    const [newPassword, setNewPassword] = useState<string>(
        initialPassword ?? ""
    );
    const [roomHasPassword, setRoomHasPassword] = useState(
        initialPassword ? true : false
    );

    const sendUpdatedPassword = async (customPassword: string = "") => {
        try {
            const res = await fetch("http://localhost:4000/room-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    peerId,
                    roomId,
                    password: customPassword,
                }),
            });

            const data = (await res.json()) as RoomPasswordCallbackParams;

            if (typeof data.roomHasPassword === "boolean") {
                setRoomHasPassword(data.roomHasPassword);
            } else {
                logData({
                    title: "Something went wrong when updating room password",
                    data,
                    type: "error",
                    layer: "*",
                    timeStamp: true,
                    clearConsole: true,
                });
                throw new Error("Something went wrong when updating password");
            }

            logData({
                layer: "room_ws",
                title: "Updated room password",
                timeStamp: true,
                data,
                type: "info",
            });
        } catch (error) {
            logData({
                title: "Something went wrong when updating room password",
                data: error,
                type: "error",
                layer: "*",
                timeStamp: true,
                clearConsole: true,
            });
        }
    };

    const removePassword = async () => {
        setNewPassword("");
        await sendUpdatedPassword();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendUpdatedPassword(newPassword);
    };

    return {
        newPassword,
        setNewPassword,
        roomHasPassword,
        removePassword,
        sendUpdatedPassword,
        handleSubmit,
    } as const;
};

export default useRoomPasswordUpdate;
