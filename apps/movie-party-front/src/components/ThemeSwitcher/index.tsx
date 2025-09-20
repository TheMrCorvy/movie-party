import { useContext } from "react";
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../context/ThemeContext/ThemeContextProvider";
import styles from "./styles";

const ThemeSwitcher = () => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ThemeContext);
    const { containerStyles } = styles(theme.palette.mode);

    return (
        <Box sx={containerStyles}>
            <IconButton onClick={toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? (
                    <Brightness4Icon />
                ) : (
                    <Brightness7Icon />
                )}
            </IconButton>
        </Box>
    );
};

export default ThemeSwitcher;
