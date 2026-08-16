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
import { hgts } from "@salvatore.hakase/hgts";
import { resources } from "./lib/HGTS";

const getBrowserLanguage = (): string => {
    if (typeof navigator === "undefined") {
        return "es";
    }
    const lang = navigator.language || (navigator as any).userLanguage || "";
    const shortLang = lang.split("-")[0].toLowerCase();
    if (shortLang === "es") {
        return "es";
    }
    return "en";
};

hgts.setup({
    resources,
    defaultLocale: getBrowserLanguage(),
    fallbackLocale: "en",
});

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
