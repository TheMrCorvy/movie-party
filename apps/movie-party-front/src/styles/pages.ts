import type { SxProps, Theme } from "@mui/material/styles";

export const roomContainerStyles: SxProps<Theme> = {
    color: "white",
    padding: 0,
};

export const roomChatSectionStyles: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    justifyContent: "center",
};

export const roomHeaderStyles: SxProps<Theme> = {
    textAlign: "center",
};

export const roomVideoSectionStyles: SxProps<Theme> = {
    marginBottom: "20px",
};

export const peerVideosContainerStyles: SxProps<Theme> = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
};
