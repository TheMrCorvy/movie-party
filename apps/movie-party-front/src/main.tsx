import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RoomProvider } from "./context/RoomContextProvider";
import Home from "./pages/Home.tsx";
import Room from "./pages/Room.tsx";
import theme from "./themes/theme";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <RoomProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/room/:roomId" element={<Room />} />
                    </Routes>
                </RoomProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);
