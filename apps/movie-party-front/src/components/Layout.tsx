import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, type FC } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useRoom } from "../context/RoomContext/RoomContextProvider";

export const Layout: FC = () => {
    const { room } = useRoom();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(room);
        const pageIsRoom = window.location.pathname.split("/")[1] === "room";
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
