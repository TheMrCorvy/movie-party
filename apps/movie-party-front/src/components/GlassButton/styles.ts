import type { SxProps, Theme } from "@mui/material/styles";

export const glassButton: SxProps<Theme> = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    padding: "10px 20px",
    borderRadius: 2,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "&:hover": {
        backgroundColor: "rgba(150, 150, 150, 0.2)",
    },
};

export const sendButtonStyles: SxProps<Theme> = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    color: "white",
};
