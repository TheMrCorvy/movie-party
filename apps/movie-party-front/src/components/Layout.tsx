import { Outlet } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ThemeSwitcher from "./ThemeSwitcher";
import type { FC } from "react";

export const Layout: FC = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <AppBar component="nav">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        My App
                    </Typography>
                    <ThemeSwitcher />
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
};
