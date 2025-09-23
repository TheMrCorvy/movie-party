import { Box, useTheme } from "@mui/material";
import type { FC } from "react";
import styles from "./styles";

export interface GlassContainerProps {
    height?: string | number;
    width?: string | number;
    direction?:
        | "row"
        | "column"
        | "-moz-initial"
        | "column-reverse"
        | "inherit"
        | "initial"
        | "revert"
        | "revert-layer"
        | "row-reverse"
        | "unset";
    children: React.ReactNode;
}

const GlassContainer: FC<GlassContainerProps> = ({
    children,
    height,
    width,
    direction = "column",
}) => {
    const theme = useTheme();
    const { containerStyles } = styles(theme.palette.mode);

    return (
        <Box
            sx={{
                ...containerStyles,
                height: height || "fit-content",
                width: width || "fit-content",
                flexDirection: direction,
            }}
        >
            {children}
        </Box>
    );
};

export default GlassContainer;
