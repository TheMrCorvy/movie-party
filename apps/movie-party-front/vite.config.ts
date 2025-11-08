import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react()],
        optimizeDeps: {
            include: ["@mui/material", "@mui/icons-material"],
        },
        define: {
            "process.env": env,
        },
        server: {
            allowedHosts: ["conference-room.chaldea.foundation", "localhost"],
        },
    };
});
