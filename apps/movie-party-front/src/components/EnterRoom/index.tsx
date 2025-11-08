import { ChangeEvent, FC, useState } from "react";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import { stringIsEmpty } from "@repo/shared-utils";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { logData } from "@repo/shared-utils/log-data";

export interface EnterRoomParams {
    roomExists: boolean;
    roomHasPassword: boolean;
}

const EnterRoom: FC<EnterRoomParams> = ({ roomExists, roomHasPassword }) => {
    const [myName, setMyName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const { room } = useRoom();

    const handleEnterRoom = async () => {
        if (
            !roomExists ||
            stringIsEmpty(myName) ||
            (roomHasPassword && !password)
        ) {
            setError(true);
            return;
        }

        setError(false);

        logData({
            data: "Entering room...",
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });

        const res = await fetch(
            `${process.env.BACKEND_BASE_PATH || "http://localhost:4000"}/room-password`,
            {
                method: "POST",
                body: JSON.stringify({
                    peerId: room.myId,
                    peerName: myName,
                    password,
                    roomId: room.id,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const fullRes = await res.json();

        if (fullRes.status !== 200) {
            setError(true);

            logData({
                layer: "room_ws",
                timeStamp: true,
                title: "Something went worng validating room password",
                data: error,
                type: "error",
            });
        }

        logData({
            title: "Response recevied from password validation",
            data: fullRes,
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });
    };

    return (
        <>
            <GlassInput
                type="text"
                kind="text input"
                size="medium"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setError(false);
                    setMyName(e.target.value);
                }}
                error={error}
                helperText={
                    error ? "Los datos ingresados son incorrectos" : undefined
                }
                label="Nombre"
            />
            {roomHasPassword && (
                <GlassInput
                    type="password"
                    kind="text input"
                    label="Contraseña"
                    size="medium"
                    name="password"
                    error={error}
                    helperText={
                        error
                            ? "Los datos ingresados son incorrectos"
                            : undefined
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        setError(false);
                        setPassword(e.target.value);
                    }}
                />
            )}
            <GlassButton onClick={handleEnterRoom}>
                Ingresar a la sala de conferencias
            </GlassButton>
        </>
    );
};

export default EnterRoom;
