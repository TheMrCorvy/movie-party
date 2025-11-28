import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { logData } from "@repo/shared-utils/log-data";

export const getUserVideoTrack = async (): Promise<MediaStreamTrack> => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });
    return stream.getVideoTracks()[0];
};

export const getUserAudioTrack = async (): Promise<MediaStreamTrack | null> => {
    const accessMicrophone = isFeatureFlagEnabled(
        FeatureNames.ACCESS_MICROPHONE
    );
    if (!accessMicrophone) return null;
    const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
        },
    });
    return stream.getAudioTracks()[0];
};

export const getUserScreen = async (): Promise<MediaStream> => {
    const accessMicrophone = isFeatureFlagEnabled(
        FeatureNames.ACCESS_MICROPHONE
    );
    return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: accessMicrophone,
    });
};

export const stopAllTracks = (stream?: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
};

export const stopVideoTrack = (stream?: MediaStream | null) => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => track.stop());
};

export const stopAudioTrack = (stream?: MediaStream | null) => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => track.stop());
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
