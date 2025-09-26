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
