import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { logData } from "@repo/shared-utils/log-data";
import { useCallback } from "react";

export enum NotificationSounds {
    ENTERING_ROOM = "entering_room",
    MESSAGE_RECEIVED = "message_received",
    NEW_PEER = "new_peer",
    PEER_LEFT = "peer_left",
    LEFT_THE_ROOM = "left_the_room",
}

export interface PlaySoundParams {
    filename: NotificationSounds;
    callback?: () => void;
}

const useNotificationSound = () => {
    const playSound = useCallback((params: PlaySoundParams) => {
        if (!isFeatureFlagEnabled(FeatureNames.PLAY_SOUNDS)) {
            if (params?.callback) {
                params.callback();
            }

            return;
        }
        const audioUrl = new URL(
            `../assets/${params.filename}.mp3`,
            import.meta.url
        ).href;
        const audio = new Audio(audioUrl);

        logData({
            layer: "access_user_hardware",
            title: "Playing notification sound",
            data: { filename: params.filename, audioUrl },
            type: "info",
            timeStamp: true,
            addSpaceAfter: true,
        });

        audio
            .play()
            .catch((err) => {
                const error = err as Error & { name?: string };
                logData({
                    layer: "*",
                    title: "Error playing notification sound",
                    data: {
                        filename: params.filename,
                        audioUrl,
                        error: { name: error.name, message: error.message },
                    },
                    type: "error",
                    timeStamp: true,
                    addSpaceAfter: true,
                });
            })
            .finally(() => {
                logData({
                    layer: "access_user_hardware",
                    title: "Finished playing notification sound",
                    data: { filename: params.filename, audioUrl },
                    type: "info",
                    timeStamp: true,
                    addSpaceAfter: true,
                });

                if (params?.callback) {
                    params.callback();
                }
            });
    }, []);

    return { playSound };
};

export default useNotificationSound;
