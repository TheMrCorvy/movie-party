import { ChangeEvent, FC, useState } from "react";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import { Typography } from "@mui/material";
import { stringIsEmpty } from "@repo/shared-utils";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { logData } from "@repo/shared-utils/log-data";

export interface EnterRoomParams {
    roomExists: boolean;
    roomHasPassword: boolean;
}

const EnterRoom: FC<EnterRoomParams> = ({ roomExists, roomHasPassword }) => {
    const [myName, setMyName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const { room } = useRoom();

    const handleEnterRoom = async () => {
        if (!roomExists || stringIsEmpty(myName)) {
            return;
        }

        setError(false);

        logData({
            data: "Entering room...",
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });

        const res = await fetch("http://localhost:4000/room-password", {
            method: "POST",
            body: JSON.stringify({
                peerId: room.myId,
                peerName: myName,
                password,
                roomId: room.id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const fullRes = await res.json();

        logData({
            title: "Response recevied from password validation",
            data: fullRes,
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });

        // enterRoomService({
        //     peerId: room.myId,
        //     peerName: myName,
        //     roomId: room.id,
        //     ws,
        //     password,
        // });
    };

    return (
        <>
            <GlassInput
                type="text"
                kind="text input"
                size="small"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setMyName(e.target.value);
                }}
            />
            {roomHasPassword && (
                <GlassInput
                    type="password"
                    kind="text input"
                    label="Contraseña"
                    size="medium"
                    name="password"
                    error={error}
                    helperText="La contraseña es incorrecta"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                    }}
                />
            )}
            <GlassButton onClick={handleEnterRoom}>Enter Room</GlassButton>
            <Typography>
                Room Exists: {roomExists ? "True" : "False"}
            </Typography>
        </>
    );
};

export default EnterRoom;
