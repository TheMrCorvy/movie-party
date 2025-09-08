export const debugPeerConnection = (peer: any) => {
    console.group("🔍 PeerJS Debug Info");
    console.log("Peer ID:", peer.id);
    console.log("Peer disconnected:", peer.disconnected);
    console.log("Peer destroyed:", peer.destroyed);
    console.log("Peer options:", peer.options);
    console.log("Peer connections:", peer.connections);
    console.groupEnd();
};

export const debugCall = (call: any, label: string) => {
    console.group(`📞 Call Debug: ${label}`);
    console.log("Call peer:", call.peer);
    console.log("Call type:", call.type);
    console.log("Call open:", call.open);
    console.log("Call metadata:", call.metadata);
    console.log("Call connection ID:", call.connectionId);
    console.groupEnd();
};
