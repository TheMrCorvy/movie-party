import { useEffect, type FC } from "react";
import EnterRoom from "../components/EnterRoom";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
    const { room } = useRoom();
    const navigate = useNavigate();
    useEffect(() => {
        if (room.id && room.myId && room.participants.length === 0) {
            navigate("/room/" + room.id);
        }
    }, [room, navigate]);
    return <EnterRoom />;
};

export default Home;
