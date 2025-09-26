import { useEffect, useState, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import {
    verifyRoom,
    VerifyRoomServiceCallbackParams,
} from "../services/enterRoomService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { generateId } from "@repo/shared-utils";
import { ActionTypes } from "../context/RoomContext/roomActions";
import EnterRoom from "../components/EnterRoom";

const JoinRoom: FC = () => {
    const { ws, dispatch } = useRoom();
    const { roomId } = useParams();

    const [roomExists, setRoomExists] = useState({
        hasBeenSet: false,
        roomExists: false,
    });

    const roomWasVerified = (params: VerifyRoomServiceCallbackParams) => {
        if (!roomId || !params.roomExists || roomExists.hasBeenSet) {
            return;
        }

        setRoomExists({
            hasBeenSet: true,
            roomExists: params.roomExists,
        });

        dispatch({
            type: ActionTypes.SET_ROOM,
            payload: {
                id: roomId,
                participants: [],
                messages: [],
                myId: generateId(),
                password: params.password ? "Introducir contraseña..." : "", // to do implement password setup
                peerSharingScreen: "",
            },
        });
    };

    useEffect(() => {
        if (!roomId || roomExists.hasBeenSet) {
            return;
        }

        const unmountVerifyRoomEventListener = verifyRoom({
            roomId,
            ws,
            callback: roomWasVerified,
        });

        return () => {
            unmountVerifyRoomEventListener();
        };
    }, [ws, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container maxWidth="xl">
            <GlassContainer>
                {!roomId ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <EnterRoom roomExists={roomExists.roomExists} />
                )}
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
