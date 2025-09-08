import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";

const Room: FC = () => {
    const { roomId } = useParams();
    const { ws } = useContext(RoomContext);

    useEffect(() => {
        if (roomId) {
            ws.emit(Signals.ENTER_ROOM, { roomId });
        }
    }, [roomId, ws]);

    return (
        <div>
            <h1>Room</h1>
            <p>Room ID: {roomId}</p>
        </div>
    );
};
export default Room;
