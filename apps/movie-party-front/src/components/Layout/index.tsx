import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { type FC } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import useLayout from "./useLayout";

export const Layout: FC = () => {
    useLayout({
        pageIsRoom: window.location.pathname.split("/")[1] === "room",
    });

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ThemeSwitcher />
            <Outlet />
        </Box>
    );
};
