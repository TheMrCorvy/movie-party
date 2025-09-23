import { ChangeEvent, FC, useState } from "react";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import { Typography } from "@mui/material";
import { stringIsEmpty } from "@repo/shared-utils";
import { enterRoomService } from "../../services/enterRoomService";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";

export interface EnterRoomParams {
    roomExists: boolean;
}

const EnterRoom: FC<EnterRoomParams> = ({ roomExists }) => {
    const [myName, setMyName] = useState("");

    const { ws, room } = useRoom();

    const handleEnterRoom = () => {
        if (!roomExists || stringIsEmpty(myName)) {
            return;
        }

        enterRoomService({
            peerId: room.myId,
            peerName: myName,
            roomId: room.id,
            ws,
        });
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
            <GlassButton onClick={handleEnterRoom}>Enter Room</GlassButton>
            <Typography>
                Room Exists: {roomExists ? "True" : "False"}
            </Typography>
        </>
    );
};

export default EnterRoom;
