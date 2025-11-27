import { logData } from "@repo/shared-utils/log-data";
import { copyToClipboard } from "../utils/accessUserHardware";
import { useGlassToast } from "../context/GlassToastContext";

export interface UseClipboardProps {
    roomId: string;
}

const useClipboard = ({ roomId }: UseClipboardProps) => {
    const { dispatch } = useGlassToast();

    const handleCopy = async () => {
        const isDevEnv = process.env.WORKING_ENV === "dev";
        const domainName = window.location.hostname;
        const text = `${isDevEnv ? "http://" : "https://"}${domainName}${isDevEnv ? ":5173" : ""}/join-room/${roomId}`;
        await copyToClipboard({
            callback: (params) => {
                logData({
                    title: "Copied invitation",
                    data: params,
                    type: params ? "info" : "error",
                    timeStamp: true,
                    layer: "access_user_hardware",
                });

                if (!params) {
                    dispatch({
                        type: "SHOW_TOAST",
                        payload: {
                            message: "Error al copiar el link a la sala...",
                            severity: "error",
                        },
                    });

                    return;
                }

                dispatch({
                    type: "SHOW_TOAST",
                    payload: {
                        message: "Copiado!",
                        severity: "success",
                    },
                });
            },
            text,
        });
    };

    return { handleCopy };
};

export default useClipboard;
