import { ChangeEvent, useEffect, useState, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { verifyRoom } from "../services/enterRoomService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

const JoinRoom: FC = () => {
    const { ws } = useRoom();
    const { roomId } = useParams();
    const [myName, setMyName] = useState("");
    const [roomExists, setRoomExists] = useState(false);

    useEffect(() => {
        if (!roomId) {
            return;
        }

        const unmountEventListeners = verifyRoom({
            roomId,
            ws,
            callback: (res) => setRoomExists(res.roomExists),
        });

        return () => {
            unmountEventListeners();
        };
    }, [ws, roomId]);

    const handleEnterRoom = () => {
        if (!roomExists) {
            return;
        }
        console.log(myName);
    };

    return (
        <Container maxWidth="xl">
            <GlassContainer>
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
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
