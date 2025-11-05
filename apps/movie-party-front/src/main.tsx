import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { ThemeContextProvider } from "./context/ThemeContext/ThemeContextProvider";
import { Layout } from "./components/Layout";
import JoinRoomPage from "./pages/JoinRoomPage";
import NotFound from "./pages/NotFound";
import { RoomContextProvider } from "./context/RoomContext/RoomContextProvider";
import { BackgroundImageProvider } from "./context/BackgroundImageContext";
import "./styles/backgroundPatterns.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RoomContextProvider>
            <BackgroundImageProvider>
                <BrowserRouter>
                    <ThemeContextProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route
                                    path="/room/:roomId"
                                    element={<Room />}
                                />
                                <Route
                                    path="/join-room/:roomId"
                                    element={<JoinRoomPage />}
                                />
                            </Route>

                            {/* Page not found: explicit and catch-all */}
                            <Route path="/404" element={<NotFound />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </ThemeContextProvider>
                </BrowserRouter>
            </BackgroundImageProvider>
        </RoomContextProvider>
    </StrictMode>
);
