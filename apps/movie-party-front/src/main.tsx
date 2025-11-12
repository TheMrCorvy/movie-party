import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext/ThemeContextProvider";
import { Layout } from "./components/Layout";
import { RoomContextProvider } from "./context/RoomContext/RoomContextProvider";
import { BackgroundImageProvider } from "./context/BackgroundImageContext";
import { GlassToastProvider } from "./context/GlassToastContext";
import { GlassToast } from "./components/GlassToast";
import "./styles/backgroundPatterns.css";
import Loader from "./components/Loader";
import GlassDrawerProvider from "./context/GlassDrawerContext";
import GlassDrawer from "./components/GlassDrawer";

const Home = lazy(() => import("./pages/Home"));
const Room = lazy(() => import("./pages/Room"));
const JoinRoomPage = lazy(() => import("./pages/JoinRoomPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RoomContextProvider>
            <BackgroundImageProvider>
                <BrowserRouter>
                    <ThemeContextProvider>
                        <GlassToastProvider>
                            <GlassDrawerProvider>
                                <Suspense fallback={<Loader />}>
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
                                        <Route
                                            path="/404"
                                            element={<NotFound />}
                                        />
                                        <Route
                                            path="*"
                                            element={<NotFound />}
                                        />
                                    </Routes>
                                </Suspense>
                                <GlassDrawer />
                            </GlassDrawerProvider>
                            <GlassToast />
                        </GlassToastProvider>
                    </ThemeContextProvider>
                </BrowserRouter>
            </BackgroundImageProvider>
        </RoomContextProvider>
    </StrictMode>
);
