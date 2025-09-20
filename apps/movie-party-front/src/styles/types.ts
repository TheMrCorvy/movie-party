import type { SxProps, Theme } from "@mui/material/styles";

export interface Styles {
    [key: string]: SxProps<Theme>;
}

export type ThemeOptions = "light" | "dark";

export type StylesService = (theme?: ThemeOptions) => Styles;
