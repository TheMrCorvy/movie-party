import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { FC, ReactNode } from "react";
import {
    backdropFilter,
    borderWhite,
    darkThemeBg,
    lightThemeLighterBg,
} from "../../styles/components";

export interface Padding {
    paddingTop?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
}

export interface GlassNavbarProps {
    children: ReactNode;
    location?: "top" | "bottom";
    position?: "absolute" | "sticky" | "fixed" | "static" | "relative";
    padding?: Padding | number | string;
}

const GlassNavbar: FC<GlassNavbarProps> = ({
    children,
    location = "bottom",
    position = "static",
    padding = 0,
}) => {
    const theme = useTheme();
    const appbarLocation = {
        top: {
            top: 0,
            bottom: "auto",
        },
        bottom: {
            top: "auto",
            bottom: 0,
        },
    };

    const addPadding = () => {
        if (typeof padding === "number" || typeof padding === "string") {
            return {
                padding,
            };
        }

        return {
            ...padding,
        };
    };

    return (
        <AppBar
            position={position}
            sx={{
                // backgroundColor: "rgba(255, 255, 255, 0.15)",
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? darkThemeBg
                        : lightThemeLighterBg,
                backdropFilter,
                borderTop: borderWhite,
                // paddingTop: 2,
                // paddingBottom: 2,
                ...appbarLocation[location],
                ...addPadding(),
            }}
        >
            <Toolbar>{children}</Toolbar>
        </AppBar>
    );
};

export default GlassNavbar;
