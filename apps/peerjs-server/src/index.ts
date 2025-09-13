import { PeerServer } from "peer";

const PORT = process.env.PEERJS_PORT ? parseInt(process.env.PEERJS_PORT) : 9000;

const peerServer = PeerServer({
    port: PORT,
    path: "/",
});

peerServer.on("connection", (client) => {
    console.log(`Peer connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
    console.log(`Peer disconnected: ${client.getId()}`);
});

console.log(`🚀 PeerJS server is running on port ${PORT}`);
console.log(
    `✅ Verify that the server is running by visiting: http://localhost:${PORT}`
);
