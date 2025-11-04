import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { type FC, useEffect, useRef } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import useLayout from "./useLayout";
import { useBackground } from "../../context/BackgroundImageContext";
import { BackgroundImageInput } from "../BackgroundImageInput";

export const Layout: FC = () => {
    const { background, patternClass } = useBackground();

    useLayout({
        pageIsRoom: window.location.pathname.split("/")[1] === "room",
    });

    const prevPatternRef = useRef<string | null>(null);

    useEffect(() => {
        // If a pattern class is active, let html handle the background and make
        // body transparent. Otherwise, apply the chosen background image to body.
        if (patternClass) {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundColor = "transparent";
        } else {
            document.body.style.backgroundImage = `url(${background})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        }
        document.body.style.height = "100vh";
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
            <ThemeSwitcher />
            <BackgroundImageInput />
            <Outlet />
        </Box>
    );
};

/**
 * html {
  --s: 126px; /* control the size*/
//   --c1: #e7525b;
//   --c2: #78dbf0;

//   --_g: 80%,var(--c1) 25.4%,#0000 26%;
//   background:
//    radial-gradient(at 80% var(--_g)),
//    radial-gradient(at 20% var(--_g)),
//    conic-gradient(from -45deg at 50% 41%,var(--c1) 90deg,var(--c2) 0)
//       calc(var(--s)/2) 0;
//   background-size: var(--s) var(--s);
// }
