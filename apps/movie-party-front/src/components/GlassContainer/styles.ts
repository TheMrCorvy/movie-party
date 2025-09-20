import type { SxProps, Theme } from "@mui/material/styles";

export const containerStyles: SxProps<Theme> = {
    p: 2,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.3)", // to do: implement dark theme rgba(0, 0, 0, 0.2)
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};
