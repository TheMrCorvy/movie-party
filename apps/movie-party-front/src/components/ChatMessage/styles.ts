import type { SxProps, Theme } from "@mui/material/styles";

export const dividerStyles: SxProps<Theme> = {
    borderColor: "rgba(255, 255, 255, 0.2)",
};

export const messageStyles: SxProps<Theme> = {
    color: "text.secondary",
    display: "block",
};

export const nameStyles: SxProps<Theme> = {
    fontWeight: "bold",
    color: "text.primary",
};
