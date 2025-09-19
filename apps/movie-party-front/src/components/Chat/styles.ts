import type { SxProps, Theme } from "@mui/material/styles";

export const chatBoxStyles: SxProps<Theme> = {
    width: "100%",
    maxWidth: 500,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
};

export const chatListStyles: SxProps<Theme> = {
    flexGrow: 1,
    overflowY: "auto",
    height: "70vh",
    p: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    "&::-webkit-scrollbar": {
        width: "8px",
    },
    "&::-webkit-scrollbar-track": {
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        backdropFilter: "blur(10px)",
        margin: "8px 0",
    },
    "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.3)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        "&:hover": {
            background: "rgba(255, 255, 255, 0.4)",
        },
        "&:active": {
            background: "rgba(255, 255, 255, 0.5)",
        },
    },
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
};

export const dividerStyles: SxProps<Theme> = {
    borderColor: "rgba(255, 255, 255, 0.2)",
};
