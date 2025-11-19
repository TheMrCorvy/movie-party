import { useEffect, useState } from "react";

import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { verifyRoom } from "../../services/enterRoomService";
import { useParams } from "react-router-dom";

import { generateId } from "@repo/shared-utils";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { logData } from "@repo/shared-utils/log-data";
import { RoomExistsWsCallbackParams } from "@repo/type-definitions/rooms";
import { useNavigate } from "react-router-dom";
import { useBackground } from "../../context/BackgroundImageContext";
import { PatternClass } from "@repo/type-definitions";

const useJoinRoom = () => {
    const { ws, dispatch } = useRoom();
    const { dispatch: backgroundDispatch } = useBackground();
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomExists, setRoomExists] = useState({
        hasBeenSet: false,
        roomExists: false,
        password: false,
    });

    const roomWasVerified = (params: RoomExistsWsCallbackParams) => {
        if (!params.roomExists) {
            navigate("/404");
        }

        if (!roomId || roomExists.hasBeenSet) {
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
                myCameraIsOn: false,
            },
        });

        if (!params.hasCustomBg || !params.hasCustomBg.src) {
            return;
        }

        if (params.hasCustomBg.isCssPattern) {
            backgroundDispatch({
                type: "SET_PATTERN",
                payload: params.hasCustomBg.src as PatternClass,
            });

            return;
        }

        backgroundDispatch({
            type: "SET_BACKGROUND",
            payload: `${process.env.BACKEND_BASE_PATH || "http://localhost:4000"}${params.hasCustomBg.src}`,
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

    return {
        roomExists,
        roomId,
    };
};

export default useJoinRoom;
