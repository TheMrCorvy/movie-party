import { ChangeEvent, useEffect, useState, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import {
    enterRoomService,
    verifyRoom,
    VerifyRoomServiceCallbackParams,
} from "../services/enterRoomService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import generateId from "../utils/generateId";
import stringIsEmpty from "../utils/stringIsEmpty";
import { ActionTypes } from "../context/RoomContext/roomActions";

const JoinRoom: FC = () => {
    const { ws, dispatch } = useRoom();
    const { roomId } = useParams();
    const [myName, setMyName] = useState("");
    const [myId, setMyId] = useState("");
    const [roomExists, setRoomExists] = useState(false);

    const handleEnterRoom = () => {
        if (
            !roomExists ||
            !roomId ||
            stringIsEmpty(myId) ||
            stringIsEmpty(myName)
        ) {
            return;
        }

        enterRoomService({
            peerId: myId,
            peerName: myName,
            roomId,
            ws,
        });
    };

    const roomWasVerified = (params: VerifyRoomServiceCallbackParams) => {
        setRoomExists(params.roomExists);

        if (!roomId || !params.roomExists) {
            return;
        }

        dispatch({
            type: ActionTypes.SET_ROOM,
            payload: {
                id: roomId,
                participants: [],
                messages: [],
                myId,
            },
        });
    };

    useEffect(() => {
        if (!roomId) {
            return;
        }

        if (!myId) {
            setMyId(generateId());
        }

        const unmountVerifyRoomEventListener = verifyRoom({
            roomId,
            ws,
            callback: roomWasVerified,
        });

        return () => {
            unmountVerifyRoomEventListener();
        };
    }, [ws, roomId, myId, myName]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container maxWidth="xl">
            <GlassContainer>
                {!myId ? (
                    <Typography>Loading...</Typography>
                ) : (
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
                        <GlassButton onClick={handleEnterRoom}>
                            Enter Room
                        </GlassButton>
                        <Typography>
                            Room Exists: {roomExists ? "True" : "False"}
                        </Typography>
                    </>
                )}
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
