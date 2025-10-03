import { useEffect, useState, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { verifyRoom } from "../services/enterRoomService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { generateId } from "@repo/shared-utils";
import { ActionTypes } from "../context/RoomContext/roomActions";
import EnterRoom from "../components/EnterRoom";
import { logData } from "@repo/shared-utils/log-data";
import { RoomExistsWsCallbackParams } from "@repo/type-definitions/rooms";

const JoinRoom: FC = () => {
    const { ws, dispatch } = useRoom();
    const { roomId } = useParams();

    const [roomExists, setRoomExists] = useState({
        hasBeenSet: false,
        roomExists: false,
        password: false,
    });

    const roomWasVerified = (params: RoomExistsWsCallbackParams) => {
        if (!roomId || !params.roomExists || roomExists.hasBeenSet) {
            return;
        }

        logData({
            title: "Room exists verification received",
            data: params,
            timeStamp: true,
            type: "info",
            layer: "room_ws",
        });

        setRoomExists({
            hasBeenSet: true,
            roomExists: params.roomExists,
            password: params.password,
        });

        dispatch({
            type: ActionTypes.SET_ROOM,
            payload: {
                id: roomId,
                participants: [],
                messages: [],
                myId: generateId(),
                peerSharingScreen: "",
                imRoomOwner: false,
            },
        });
    };

    useEffect(() => {
        if (!roomId || roomExists.hasBeenSet) {
            return;
        }

        logData({
            title: "Listening to verify room event",
            type: "info",
            layer: "room_ws",
        });

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
                    <EnterRoom
                        roomHasPassword={roomExists.password}
                        roomExists={roomExists.roomExists}
                    />
                )}
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
