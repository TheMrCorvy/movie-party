import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import type { FC } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export const Layout: FC = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ThemeSwitcher />
            <Outlet />
        </Box>
    );
};
