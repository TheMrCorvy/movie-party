import { Box, useTheme } from "@mui/material";
import type { ElementType } from "react";
import styles from "./styles";

type GlassContainerProps<T extends ElementType = "section"> = {
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
    gap?: number | string;
    children: React.ReactNode;
    justifyContent?: "start" | "end" | "space-between" | "space-around";
    primitive?: T;
} & React.ComponentPropsWithoutRef<T>;

function GlassContainer<T extends ElementType = "section">({
    children,
    height,
    width,
    direction = "column",
    gap = 2,
    justifyContent = "start" as const,
    primitive = "section" as T,
    ...restProps
}: GlassContainerProps<T>) {
    const theme = useTheme();
    const { containerStyles } = styles(theme.palette.mode);

    return (
        <Box
            component={primitive}
            sx={{
                ...containerStyles,
                height: height || "fit-content",
                width: width || "fit-content",
                flexDirection: direction,
                gap,
                justifyContent: justifyContent as any,
            }}
            {...(restProps as any)}
        >
            {children}
        </Box>
    );
}

export default GlassContainer;
