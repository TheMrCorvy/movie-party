import { v4 as uuidV4 } from "uuid";
import Peer from "peerjs";
import { Socket } from "socket.io-client";
import { Signals } from "@repo/type-definitions/rooms";

interface SetMeUpParams {
    setMe: React.Dispatch<React.SetStateAction<Peer | undefined>>;
    ws: Socket;
    enterRoom: (data: { roomId: string }) => void;
    removePeer: (peerId: string) => void;
    setStream: (stream: MediaStream) => void;
}

const setMeUp = ({
    setMe,
    setStream,
    ws,
    enterRoom,
    removePeer,
}: SetMeUpParams) => {
    const meId = uuidV4();
    const peer = new Peer(meId);

    peer.on("open", () => {
        setMe(peer);
    });

    peer.on("error", (err) => {
        console.error("❌ PeerJS error:", err);
        console.error("Error type:", err.type);
    });

    peer.on("disconnected", () => {
        peer.reconnect();
    });

    peer.on("close", () => {
        console.log("🔴 PeerJS connection closed");
    });

    try {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false }) // to do: implement FF here
            .then((stream) => {
                setStream(stream);
            })
            .catch((err) => {
                console.error("Failed to get user media:", err);
            });
    } catch (error) {
        console.error("getUserMedia error:", error);
    }

    ws.on(Signals.ROOM_CREATED, enterRoom);
    ws.on(Signals.USER_LEFT, removePeer);

    return () => {
        ws.off(Signals.ROOM_CREATED, enterRoom);
        ws.off(Signals.USER_LEFT, removePeer);
        peer.destroy();
    };
};

export default setMeUp;
