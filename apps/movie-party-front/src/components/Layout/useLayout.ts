import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { updateParticipantsService } from "../../services/updateParticipantsService";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { roomWasCreated } from "../../services/createRoomService";

export interface UseLayoutPops {
    pageIsRoom: boolean;
}

const useLayout = ({ pageIsRoom }: UseLayoutPops) => {
    const { room, ws, dispatch } = useRoom();
    const navigate = useNavigate();

    useEffect(() => {
        const roomWasCreatedEvent = roomWasCreated({
            ws,
            callback: (params) =>
                dispatch({
                    type: ActionTypes.SET_ROOM,
                    payload: {
                        ...params.room,
                        myId: params.room.participants[0].id,
                    },
                }),
        });

        const updateParticipantsEvent = updateParticipantsService({
            ws,
            callback: (params) => {
                if (room.id === params.roomId && pageIsRoom) {
                    dispatch({
                        type: ActionTypes.UPDATE_PARTICIPANTS,
                        payload: params.participants,
                    });
                    return;
                }

                if (room.id === params.roomId && !pageIsRoom) {
                    dispatch({
                        type: ActionTypes.JOIN_ROOM,
                        payload: {
                            participants: params.participants,
                            myId: room.myId,
                            roomId: params.roomId,
                            messages: params.messages,
                        },
                    });
                    return;
                }

                console.error("Something happened...");
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
            navigate("/room/" + room.id);
        }
    }, [room, navigate, pageIsRoom]);
};

export default useLayout;
