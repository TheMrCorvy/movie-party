import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";

const Room: FC = () => {
    const { roomId } = useParams();
    const { ws, me } = useContext(RoomContext);

    useEffect(() => {
        if (roomId && me) {
            ws.emit(Signals.ENTER_ROOM, { roomId, peerId: me._id });
        }
    }, [roomId, ws, me]);

    return (
        <div>
            <h1>Room</h1>
            <p>Room ID: {roomId}</p>
        </div>
    );
};
export default Room;
