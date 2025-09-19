import type { SxProps, Theme } from "@mui/material/styles";

export const videoContainerStyles: SxProps<Theme> = {
    display: "inline-block",
    margin: "10px",
    borderRadius: 2,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
};

export const videoStyles: SxProps<Theme> = {
    width: "300px",
    height: "200px",
    objectFit: "cover",
    display: "block",
};

export const peerLabelStyles: SxProps<Theme> = {
    padding: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
};

export const peerTextStyles: SxProps<Theme> = {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "0.75rem",
    fontWeight: 500,
};
