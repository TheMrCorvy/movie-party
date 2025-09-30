import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { logData } from "@repo/shared-utils/log-data";

export const getUserScreen = async (): Promise<MediaStream> => {
    const accessMicrophone = isFeatureFlagEnabled(
        FeatureNames.ACCESS_MICROPHONE
    );
    return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: accessMicrophone,
    });
};

export const getUserCamera = async (): Promise<MediaStream> => {
    const accessMicrophone = isFeatureFlagEnabled(
        FeatureNames.ACCESS_MICROPHONE
    );
    return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: accessMicrophone,
    });
};

export const stopAllTracks = (stream?: MediaStream | null) => {
    if (!stream) return;

    return stream.getTracks().forEach((track) => track.stop());
};

export interface CopyToClipboardparams {
    text: string;
    callback: (success: boolean) => void;
}

export type CopyToClipboard = (params: CopyToClipboardparams) => Promise<void>;

export const copyToClipboard: CopyToClipboard = async ({ text, callback }) => {
    try {
        await navigator.clipboard.writeText(text);

        callback(true);
    } catch (err) {
        logData({
            type: "error",
            layer: "*",
            title: "Failed to copy text",
            data: err,
            timeStamp: true,
            addSpaceAfter: true,
        });
        callback(false);
    }
};
