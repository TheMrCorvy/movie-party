import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomProvider } from "./context/RoomContext/RoomContextProvider";
import Home from "./pages/Home.tsx";
import Room from "./pages/Room.tsx";
import { ThemeContextProvider } from "./context/ThemeContext/ThemeContextProvider.tsx";
import { Layout } from "./components/Layout.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <RoomProvider>
                <ThemeContextProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="/room/:roomId" element={<Room />} />
                        </Route>
                    </Routes>
                </ThemeContextProvider>
            </RoomProvider>
        </BrowserRouter>
    </StrictMode>
);
