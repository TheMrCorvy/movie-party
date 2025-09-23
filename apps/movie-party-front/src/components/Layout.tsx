import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, type FC } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { updateParticipantsService } from "../services/updateParticipantsService";
import { ActionTypes } from "../context/RoomContext/roomActions";

const pageIsRoom = window.location.pathname.split("/")[1] === "room";

export const Layout: FC = () => {
    const { room, ws, dispatch } = useRoom();
    const navigate = useNavigate();

    useEffect(() => {
        const unmountEventListener = updateParticipantsService({
            ws,
            callback: (params) => {
                console.log({
                    params,
                    localRoomId: room.id,
                    pageIsRoom,
                    page: window.location.pathname.split("/"),
                });
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
                        },
                    });
                    return;
                }

                console.error("Something happened...");
            },
        });

        return () => {
            unmountEventListener();
        };
    }, [ws, dispatch, room.id, room.myId]);

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
    }, [room, navigate]);
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ThemeSwitcher />
            <Outlet />
        </Box>
    );
};
