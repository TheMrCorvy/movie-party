import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { updateParticipantsService } from "../../services/updateParticipantsService";
import { listenBackgroundUpdates } from "../../services/roomBackgroundService";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { roomWasCreated } from "../../services/createRoomService";
import { logData } from "@repo/shared-utils/log-data";
import { useBackground } from "../../context/BackgroundImageContext";
import { PatternClass } from "@repo/type-definitions";

export interface UseLayoutPops {
    pageIsRoom: boolean;
}

const useLayout = ({ pageIsRoom }: UseLayoutPops) => {
    const { room, ws, dispatch } = useRoom();
    const navigate = useNavigate();
    const { dispatch: backgroundDispatch } = useBackground();

    useEffect(() => {
        const updateParticipantsEvent = updateParticipantsService({
            ws,
            callback: (params) => {
                if (room.id === params.roomId && pageIsRoom) {
                    logData({
                        title: "Updating participants",
                        data: params,
                        timeStamp: true,
                        type: "info",
                        layer: "participants_update",
                    });
                    dispatch({
                        type: ActionTypes.UPDATE_PARTICIPANTS,
                        payload: params.participants,
                    });
                    return;
                }

                if (room.id === params.roomId && !pageIsRoom) {
                    logData({
                        title: "Joined the room",
                        data: params,
                        timeStamp: true,
                        type: "info",
                        layer: "room_ws",
                    });
                    dispatch({
                        type: ActionTypes.JOIN_ROOM,
                        payload: {
                            participants: params.participants,
                            myId: room.myId,
                            roomId: params.roomId,
                            messages: params.messages,
                            peerSharingScreen: params.peerSharingScreen,
                        },
                    });
                    return;
                }

                logData({
                    title: "Something happened",
                    layer: "*",
                    timeStamp: true,
                    type: "error",
                    data: {
                        ...params,
                        message:
                            "Something went wrong when validating update participants in useLayout",
                    },
                });
            },
        });

        return () => {
            updateParticipantsEvent();
        };
    }, [ws, dispatch, room.id, room.myId, pageIsRoom]);

    useEffect(() => {
        const roomWasCreatedEvent = roomWasCreated({
            ws,
            callback: (params) => {
                logData({
                    title: "Room was created",
                    data: params,
                    timeStamp: true,
                    type: "info",
                    layer: "room_ws",
                });
                dispatch({
                    type: ActionTypes.SET_ROOM,
                    payload: {
                        ...params.room,
                        myId: params.room.participants[0].id,
                        imRoomOwner: true,
                        password: params.password,
                    },
                });
            },
        });

        return () => {
            roomWasCreatedEvent();
        };
    }, [dispatch, ws]);

    useEffect(() => {
        const unmountBackgroundUpdated = listenBackgroundUpdates({
            ws,
            callback: (params) => {
                if (!room.id) return;

                logData({
                    title: "Background updated",
                    data: params,
                    timeStamp: true,
                    type: "info",
                    layer: "room_ws",
                });

                if (params.background.isCssPattern) {
                    backgroundDispatch({
                        type: "SET_PATTERN",
                        payload: params.background.src as PatternClass,
                    });

                    return;
                }

                backgroundDispatch({
                    type: "SET_BACKGROUND",
                    payload: `http://localhost:4000${params.background.src}`,
                });
            },
        });

        return () => {
            unmountBackgroundUpdated();
        };
    }, [ws, dispatch, room, backgroundDispatch]);

    useEffect(() => {
        const imInTheRoom = room.participants.find(
            (participant) => participant.id === room.myId
        );

        if (
            room.id &&
            room.myId &&
            room.participants.length > 0 &&
            imInTheRoom !== undefined &&
            !pageIsRoom &&
            imInTheRoom.name
        ) {
            logData({
                title: "I am in the room",
                data: imInTheRoom,
                timeStamp: true,
                type: "info",
                layer: "room_ws",
            });
            navigate("/room/" + room.id);
            return;
        }

        if (pageIsRoom && !imInTheRoom) {
            navigate("/not-found");
        }

        logData({
            title: "I'm not in the room",
            data: room.id,
            timeStamp: true,
            type: "info",
            layer: "room_ws",
        });
    }, [room, navigate, pageIsRoom]);
};

export default useLayout;
