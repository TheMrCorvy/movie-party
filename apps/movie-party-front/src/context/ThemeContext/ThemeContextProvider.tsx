import { useMemo, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, type PaletteMode } from "@mui/material";
import getDesignTokens from "../../themes/theme";
import { ThemeContext } from "./ThemeContext";

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<PaletteMode>("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                );
            },
        }),
        []
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
