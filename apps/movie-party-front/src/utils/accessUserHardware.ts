export const getUserScreen = async (): Promise<MediaStream> => {
    return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // to do: implement FF
    });
};

export const getUserCamera = async (): Promise<MediaStream> => {
    return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // to do: implement FF
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
        console.error("Failed to copy text: ", err);
        callback(false);
    }
};
