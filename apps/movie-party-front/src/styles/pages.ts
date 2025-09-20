import type { SxProps, Theme } from "@mui/material/styles";

// Room page styles
export const roomContainerStyles: SxProps<Theme> = {
    height: "100vh",
    color: "white",
    padding: 0,
};

export const roomGridContainerStyles: SxProps<Theme> = {
    height: "100vh",
};

export const roomMainContentStyles: SxProps<Theme> = {
    padding: "24px",
    overflowY: "auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

export const roomChatSectionStyles: SxProps<Theme> = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "24px 12px",
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
// End of room page styles
