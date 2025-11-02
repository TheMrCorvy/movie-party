import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { type FC, useEffect } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import useLayout from "./useLayout";
import { useBackground } from "../../context/BackgroundImageContext";
import { BackgroundImageInput } from "../BackgroundImageInput";

export const Layout: FC = () => {
    const { background } = useBackground();

    useLayout({
        pageIsRoom: window.location.pathname.split("/")[1] === "room",
    });

    useEffect(() => {
        document.body.style.backgroundImage = `url(${background})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.height = "100vh";
    }, [background]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ThemeSwitcher />
            <BackgroundImageInput />
            <Outlet />
        </Box>
    );
};
