import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react()],
        optimizeDeps: {
            include: ["@mui/material", "@mui/icons-material"],
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Vendor chunks
                        "react-vendor": [
                            "react",
                            "react-dom",
                            "react-router-dom",
                        ],
                        "mui-vendor": ["@mui/material", "@mui/icons-material"],
                        "socket-vendor": ["socket.io-client"],
                        "peer-vendor": ["peerjs"],
                    },
                },
            },
            // Code splitting optimizations
            chunkSizeWarningLimit: 1000,
        },
        define: {
            "process.env": env,
        },
        server: {
            allowedHosts: ["conference.chaldea.foundation", "localhost"],
        },
    };
});
