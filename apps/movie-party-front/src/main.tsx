import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { ThemeContextProvider } from "./context/ThemeContext/ThemeContextProvider";
import { Layout } from "./components/Layout";
import JoinRoom from "./pages/JoinRoom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeContextProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/room/:roomId" element={<Room />} />
                        <Route
                            path="/join-room/:roomId"
                            element={<JoinRoom />}
                        />
                    </Route>
                </Routes>
            </ThemeContextProvider>
        </BrowserRouter>
    </StrictMode>
);
