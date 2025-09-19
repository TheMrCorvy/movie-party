import type { SxProps, Theme } from "@mui/material/styles";

export const messageStyles: SxProps<Theme> = {
    color: "text.primary",
    display: "block",
    fontWeight: 500,
    fontSize: 14,
    whiteSpace: "pre-wrap",
};

export const nameStyles: SxProps<Theme> = {
    fontWeight: 700,
    color: "text.primary",
    fontSize: 18,
};

export const listItemBackground: SxProps<Theme> = {
    px: 2,
    py: 1.5,
    backgroundColor: "rgba(150, 150, 150, 0.05)",
    borderRadius: 2,
    my: 1,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.05)",
    "&:first-of-type": { mt: 1 },
    "&:last-of-type": { mb: 1 },
};

export const listItemAvatar: SxProps<Theme> = { minWidth: "auto", mr: 1.5 };
