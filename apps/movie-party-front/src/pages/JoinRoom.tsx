import { ChangeEvent, useEffect, useState, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { enterRoomService, verifyRoom } from "../services/enterRoomService";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import generateId from "../utils/generateId";
import {
    updateParticipantsService,
    type UpdateParticipantsCallback,
} from "../services/updateParticipantsService";
import { ActionTypes } from "../context/RoomContext/roomActions";
import stringIsEmpty from "../utils/stringIsEmpty";

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

    const handleParticipantsUpdate = (params: UpdateParticipantsCallback) => {
        if (roomId !== params.roomId || stringIsEmpty(myId)) {
            return;
        }

        dispatch({
            type: ActionTypes.JOIN_ROOM,
            payload: {
                participants: params.participants,
                myId,
                roomId,
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
            callback: (params) => setRoomExists(params.roomExists),
        });

        const unmountUpdateParticipantsEventListener =
            updateParticipantsService({
                ws,
                callback: handleParticipantsUpdate,
            });

        return () => {
            unmountVerifyRoomEventListener();
            unmountUpdateParticipantsEventListener();
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
