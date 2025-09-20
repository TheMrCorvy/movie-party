import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";

export const useRoom = () => {
    const { roomId } = useParams();
    const context = useContext(RoomContext);

    useEffect(() => {
        if (context && roomId && context.me) {
            console.log(
                "Entering room:",
                roomId,
                "with peer ID:",
                context.me.id
            );
            context.ws.emit(Signals.ENTER_ROOM, {
                roomId,
                peerId: context.me.id,
            });
        }
    }, [roomId, context?.me?.id, context?.ws]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!context) {
        return {
            loading: true,
            roomId: undefined,
            shareScreen: () => {},
            videoStream: undefined,
            ownCamera: null,
            filteredPeersArr: [],
            peers: {},
            peersArr: [],
        };
    }

    const peersArr = Object.entries(context.peers);
    const video = () => {
        if (context.screenSharingId) {
            if (context.me?.id === context.screenSharingId && context.stream) {
                return context.stream;
            }
            const peer = context.peers[context.screenSharingId];
            if (peer) {
                return peer.stream;
            }
            return undefined;
        }
        if (context.stream) {
            return context.stream;
        }
        return undefined;
    };
    const videoStream = video();

    const shouldShowOwnPeerVideo = () => {
        if (context.screenSharingId) {
            if (!context.me || !context.stream) {
                return false;
            }

            if (context.screenSharingId !== context.me.id) {
                return true;
            }
        }

        return false;
    };

    const ownCamera = shouldShowOwnPeerVideo()
        ? {
              stream: context.stream as MediaStream,
              peerId: context.me!.id,
          }
        : null;

    const filteredPeersArr = peersArr.filter(
        ([peerId]) => peerId !== context.screenSharingId
    );

    return {
        loading: false,
        roomId,
        shareScreen: context.shareScreen,
        videoStream,
        ownCamera,
        filteredPeersArr,
        peers: context.peers,
        peersArr,
    };
};
