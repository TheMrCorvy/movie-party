import { useEffect, type FC } from "react";
import EnterRoom from "../components/EnterRoom";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
    const { room } = useRoom();
    const navigate = useNavigate();
    useEffect(() => {
        if (
            room.id &&
            room.myId &&
            room.participants.length === 1 &&
            room.participants[0].id === room.myId &&
            room.participants[0].name
        ) {
            navigate("/room/" + room.id);
        }
    }, [room, navigate]);
    return <EnterRoom />;
};

export default Home;
