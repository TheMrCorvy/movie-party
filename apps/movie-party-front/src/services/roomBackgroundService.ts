import { RoomBackground } from "@repo/type-definitions/rooms";

interface UploadBackgroundParams {
    file: File;
    roomId: string;
    peerId: string;
}

interface UploadBackgroundResponse {
    message: string;
    background: RoomBackground;
}

export const uploadRoomBackground = async ({
    file,
    roomId,
    peerId,
}: UploadBackgroundParams): Promise<UploadBackgroundResponse> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", roomId);
    formData.append("peerId", peerId);

    const response = await fetch("http://localhost:4000/room-background", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
    }

    return response.json();
};
