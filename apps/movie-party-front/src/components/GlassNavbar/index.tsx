import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import { FC } from "react";
import { EditLocation } from "@mui/icons-material";

const GlassBottomNavbar: FC = () => {
    return (
        <AppBar
            position="static"
            sx={{
                top: "auto",
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparent white
                backdropFilter: "blur(10px) saturate(180%)", // Glassmorphism effect
                borderTop: "1px solid rgba(255, 255, 255, 0.2)", // Subtle light border
                boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            }}
        >
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer">
                    <MenuIcon />
                </IconButton>
                {/* Container for the two FABs */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -30, // Floats the FABs 30px above the AppBar
                        left: "50%",
                        transform: "translateX(-50%)", // Centers the container horizontally
                        display: "flex",
                        gap: 3, // Space between the two FABs
                    }}
                >
                    <Fab color="secondary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Fab color="primary" aria-label="edit">
                        <EditLocation />
                    </Fab>
                    <Fab color="secondary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Box>
                <Box sx={{ flexGrow: 1 }} />{" "}
                {/* This pushes icons to the ends */}
                <IconButton color="inherit" aria-label="search">
                    <SearchIcon />
                </IconButton>
                <IconButton color="inherit" aria-label="display more actions">
                    <MoreIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default GlassBottomNavbar;
