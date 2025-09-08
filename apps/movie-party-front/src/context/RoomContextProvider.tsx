import { useEffect, useState, type FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { debugPeerConnection, debugCall } from "../utils/peerDebug";

const WS = "http://localhost:4000";

const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

interface EnterRoomResponse {
    roomId: string;
}

interface Participants {
    participants: string[];
    roomId: string;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [roomId, setRoomId] = useState<string>("");
    const [processedParticipants, setProcessedParticipants] = useState<
        Set<string>
    >(new Set());

    const enterRoom = ({ roomId }: EnterRoomResponse) => {
        setRoomId(roomId);
        navigate(`/room/${roomId}`);
    };

    // Effect to handle GET_PARTICIPANTS event
    useEffect(() => {
        if (!me || !stream) return;

        const handleGetParticipants = ({
            participants,
            roomId: receivedRoomId,
        }: Participants) => {
            console.log("\n=== GET_PARTICIPANTS RECEIVED ===");
            console.log("Room:", receivedRoomId);
            console.log("All participants:", participants);
            console.log("My ID:", me.id);
            console.log("Currently connected peers:", Object.keys(peers));
            console.log(
                "Previously processed:",
                Array.from(processedParticipants)
            );

            // Filter to get other participants we haven't processed yet
            const otherParticipants = participants.filter(
                (peerId) =>
                    peerId !== me.id && !processedParticipants.has(peerId)
            );

            if (otherParticipants.length > 0) {
                console.log(
                    "Found new participants to connect with:",
                    otherParticipants
                );

                // Mark these participants as processed
                setProcessedParticipants((prev) => {
                    const newSet = new Set(prev);
                    otherParticipants.forEach((id) => newSet.add(id));
                    return newSet;
                });

                // Initiate calls to all unconnected participants
                otherParticipants.forEach((peerId) => {
                    // Add a small delay to ensure the other peer is ready
                    setTimeout(() => {
                        console.log(`>>> Initiating call to peer: ${peerId}`);
                        console.log(
                            "My peer state:",
                            me.disconnected ? "disconnected" : "connected"
                        );

                        try {
                            const call = me.call(peerId, stream, {
                                metadata: { peerId: me.id },
                            });

                            if (!call) {
                                console.error("Failed to create call object");
                                return;
                            }

                            debugCall(call, `Outgoing to ${peerId}`);
                            debugPeerConnection(me);

                            call.on("stream", (peerStream) => {
                                console.log(
                                    `<<< Successfully received stream from peer: ${peerId}`
                                );
                                dispatch({
                                    type: "ADD_PEER",
                                    payload: { peerId, stream: peerStream },
                                });
                            });

                            call.on("error", (err) => {
                                console.error(
                                    `!!! Call error with peer ${peerId}:`,
                                    err
                                );
                                // Remove from processed so we can retry
                                setProcessedParticipants((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(peerId);
                                    return newSet;
                                });
                            });

                            call.on("close", () => {
                                console.log(`Call closed with peer ${peerId}`);
                            });
                        } catch (error) {
                            console.error(
                                `Failed to call peer ${peerId}:`,
                                error
                            );
                            // Remove from processed so we can retry
                            setProcessedParticipants((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(peerId);
                                return newSet;
                            });
                        }
                    }, 10000); // Wait 1 second to ensure other peer is ready
                });
            } else {
                console.log("No new participants to connect with");
            }
        };

        ws.on(Signals.GET_PARTICIPANTS, handleGetParticipants);

        return () => {
            ws.off(Signals.GET_PARTICIPANTS, handleGetParticipants);
        };
    }, [me, stream, peers, processedParticipants]);

    const removePeer = (peerId: string) => {
        console.log("peer left: ", peerId);
        dispatch({
            type: "REMOVE_PEER",
            payload: { peerId },
        });
    };

    useEffect(() => {
        const meId = uuidV4();
        // Use PeerJS cloud server with explicit configuration
        const peer = new Peer(meId, {
            host: "0.peerjs.com",
            port: 443,
            secure: true,
            debug: 3, // Maximum debug level
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" },
                    { urls: "stun:stun3.l.google.com:19302" },
                    { urls: "stun:stun4.l.google.com:19302" },
                ],
            },
        });

        peer.on("open", (id) => {
            console.log("✅ PeerJS connection opened with ID:", id);
            debugPeerConnection(peer);
            setMe(peer);
        });

        peer.on("error", (err) => {
            console.error("❌ PeerJS error:", err);
            console.error("Error type:", err.type);
        });

        peer.on("disconnected", () => {
            console.log("⚠️ PeerJS disconnected from signaling server");
            // Try to reconnect
            peer.reconnect();
        });

        peer.on("close", () => {
            console.log("🔴 PeerJS connection closed");
        });

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false }) // to do: implement FF here
                .then((stream) => {
                    console.log("Got user media stream");
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!me) return;

        console.log("Setting up call handler for peer:", me.id);
        console.log("Stream available:", !!stream);

        const handleUserJoined = ({ peerId }: { peerId: string }) => {
            console.log("\n=== USER_JOINED EVENT ===");
            console.log("New user joined:", peerId);
            console.log("My ID:", me.id);

            // Don't process our own join event
            if (peerId === me.id) {
                console.log("Ignoring my own join event");
                return;
            }

            // Existing users wait for the new user to call them
            console.log(
                `Existing user waiting for new peer ${peerId} to call me`
            );
        };

        ws.on(Signals.USER_JOINED, handleUserJoined);

        const handleIncomingCall = (call: any) => {
            console.log("\n=== INCOMING CALL ===");
            console.log("Receiving call from:", call.peer);
            debugCall(call, `Incoming from ${call.peer}`);
            console.log("Current peers:", Object.keys(peers));
            console.log("Stream available for answer:", !!stream);
            debugPeerConnection(me);

            if (!stream) {
                console.error("No stream available to answer call!");
                return;
            }

            // Always answer the call
            try {
                call.answer(stream);
                console.log(">>> Answering call from:", call.peer);

                call.on("stream", (remoteStream: MediaStream) => {
                    console.log("<<< Received stream from caller:", call.peer);
                    dispatch({
                        type: "ADD_PEER",
                        payload: { peerId: call.peer, stream: remoteStream },
                    });
                });

                call.on("error", (err: any) => {
                    console.error(
                        `!!! Answer call error from peer ${call.peer}:`,
                        err
                    );
                });

                call.on("close", () => {
                    console.log(`Call closed from peer ${call.peer}`);
                });
            } catch (error) {
                console.error("Failed to answer call:", error);
            }
        };

        me.on("call", handleIncomingCall);

        return () => {
            ws.off(Signals.USER_JOINED, handleUserJoined);
            me.off("call", handleIncomingCall);
        };
    }, [me, stream, peers]); // Include peers to see state updates

    console.log(
        "Current peers state:",
        peers,
        "Total peers:",
        Object.keys(peers).length
    );

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers, roomId }}>
            {children}
        </RoomContext.Provider>
    );
};
