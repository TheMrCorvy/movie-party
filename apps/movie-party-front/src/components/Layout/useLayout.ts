import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { updateParticipantsService } from "../../services/updateParticipantsService";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { roomWasCreated } from "../../services/createRoomService";
import { logData } from "@repo/shared-utils/log-data";

export interface UseLayoutPops {
    pageIsRoom: boolean;
}

const useLayout = ({ pageIsRoom }: UseLayoutPops) => {
    const { room, ws, dispatch } = useRoom();
    const navigate = useNavigate();

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
                    },
                });
            },
        });

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
            roomWasCreatedEvent();
        };
    }, [ws, dispatch, room.id, room.myId, pageIsRoom]);

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
