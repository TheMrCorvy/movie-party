import type { FC } from "react";
import EnterRoom from "../components/EnterRoom";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../context/RoomContext/roomReducer";

const Home: FC = () => {
    const { room, dispatch } = useRoom();

    const handleUpdateRoom = () => {
        const newRoom = {
            ...room,
            id: "new-room-id",
        };
        dispatch({ type: ActionTypes.SET_ROOM_ID, payload: newRoom });
    };

    return (
        <div>
            <EnterRoom />
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <h2>Room ID: {room.id}</h2>
                <button onClick={handleUpdateRoom}>Update Room ID</button>
            </div>
        </div>
    );
};

export default Home;
