import dotenv from "dotenv";
import { logData } from "@repo/shared-utils/log-data";

dotenv.config();

const initServer = async () => {
    const { PeerServer } = await import("peer");

    const PORT = process.env.PEERJS_PORT
        ? parseInt(process.env.PEERJS_PORT)
        : 9000;
    const peerjsHost =
        process.env.NODE_ENV === "dev"
            ? "http://localhost:" + PORT
            : process.env.PEERJS_BASE_URL;

    const peerServer = PeerServer({
        port: PORT,
        path: "/",
    });

    peerServer.on("connection", (client) => {
        logData({
            title: `Peer connected: ${client.getId()}`,
            data: client,
            addSpaceAfter: true,
            timeStamp: true,
            layer: "camera",
        });
    });

    peerServer.on("disconnect", (client) => {
        logData({
            title: `Peer disconnected: ${client.getId()}`,
            data: client,
            addSpaceAfter: true,
            timeStamp: true,
            layer: "camera",
        });
    });

    logData({
        title: `🚀 PeerJS server is running on port ${PORT}`,
        timeStamp: true,
        addSpaceAfter: true,
        layer: "*",
        data: {
            port: `✅ Verify that the server is running by visiting: ${peerjsHost}`,
        },
    });
};

initServer();
