import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { type FC, useEffect, useRef } from "react";
import useLayout from "./useLayout";
import { useBackground } from "../../context/BackgroundImageContext";

export const Layout: FC = () => {
    const { background, patternClass } = useBackground();

    useLayout({
        pageIsRoom: window.location.pathname.split("/")[1] === "room",
    });

    const prevPatternRef = useRef<string | null>(null);

    useEffect(() => {
        document.body.style.height = "100vh";

        if (patternClass) {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundColor = "transparent";
            return;
        }

        if (background) {
            document.body.style.backgroundImage = `url(${background})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            return;
        }

        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = "transparent";
    }, [background, patternClass]);

    useEffect(() => {
        const prev = prevPatternRef.current;
        if (prev) {
            document.documentElement.classList.remove(prev);
        }
        if (patternClass) {
            document.documentElement.classList.add(patternClass);
        }
        prevPatternRef.current = patternClass ?? null;
    }, [patternClass]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Outlet />
        </Box>
    );
};
