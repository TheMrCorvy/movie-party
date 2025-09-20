import { Box } from "@mui/material";
import type { FC } from "react";
import { containerStyles } from "./styles";

export interface GlassContainerProps {
    height?: string | number;
    width?: string | number;
    children: React.ReactNode;
}

const GlassContainer: FC<GlassContainerProps> = ({
    children,
    height,
    width,
}) => {
    return (
        <Box
            sx={{
                ...containerStyles,
                height: height || "fit-content",
                width: width || "fit-content",
            }}
        >
            {children}
        </Box>
    );
};

export default GlassContainer;
