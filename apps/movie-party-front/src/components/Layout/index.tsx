import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { type FC } from "react";
import useLayout from "./useLayout";
import useApplyBackground from "../../hooks/useApplyBackground";

export const Layout: FC = () => {
    useLayout({
        pageIsRoom: window.location.pathname.split("/")[1] === "room",
    });

    useApplyBackground();

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Outlet />
        </Box>
    );
};
