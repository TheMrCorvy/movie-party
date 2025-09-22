import { ChangeEvent, useEffect, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { verifyRoom } from "../services/enterRoomService";
import { useParams } from "react-router-dom";

const JoinRoom: FC = () => {
    const { ws } = useRoom();
    const { roomId } = useParams();

    useEffect(() => {
        if (!roomId) {
            return;
        }

        const unmountEventListeners = verifyRoom({
            roomId,
            ws,
            callback: (params) => console.log(params.room),
        });

        return () => {
            unmountEventListeners();
        };
    }, [ws, roomId]);

    return (
        <Container maxWidth="xl">
            <GlassContainer>
                <GlassInput
                    type="text"
                    kind="text input"
                    size="small"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        console.log(e.target.value);
                    }}
                />
                <GlassButton onClick={() => console.log("create room")}>
                    Create Room
                </GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
