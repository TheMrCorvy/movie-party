import { Grid } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import GlassButton from "../GlassButton";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import GlassInput from "../GlassInput";
import { logData } from "@repo/shared-utils/log-data";
import { RoomPasswordCallbackParams } from "@repo/type-definitions/rooms";
import styles from "./styles";
import { CSSProperties } from "@mui/material/styles";

export interface RoomPasswordUpdateProps {
    imRoomOwner: boolean;
    password?: string;
    roomId: string;
    peerId: string;
}

const RoomPasswordUpdate: FC<RoomPasswordUpdateProps> = ({
    imRoomOwner,
    password,
    roomId,
    peerId,
}) => {
    const [newPassword, setNewPassword] = useState(password);
    const [roomHasPassword, setRoomHasPassword] = useState(
        password ? true : false
    );
    if (!imRoomOwner) {
        return null;
    }

    const removePassword = async () => {
        setNewPassword("");
        await sendUpdatedPassword();
    };

    const sendUpdatedPassword = async (customPassword: string = "") => {
        try {
            const res = await fetch("http://localhost:4000/room-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    peerId,
                    roomId,
                    password: customPassword,
                }),
            });

            const data = (await res.json()) as RoomPasswordCallbackParams;

            if (typeof data.roomHasPassword === "boolean") {
                setRoomHasPassword(data.roomHasPassword);
            } else {
                logData({
                    title: "Something went wrong when updating room password",
                    data,
                    type: "error",
                    layer: "*",
                    timeStamp: true,
                    clearConsole: true,
                });
                throw new Error("Something went wrong when updating password");
            }

            logData({
                layer: "room_ws",
                title: "Updated room password",
                timeStamp: true,
                data,
                type: "info",
            });
        } catch (error) {
            logData({
                title: "Something went wrong when updating room password",
                data: error,
                type: "error",
                layer: "*",
                timeStamp: true,
                clearConsole: true,
            });
        }
    };

    const { sectionContainer, gridContainer } = styles();

    return (
        <section style={sectionContainer as CSSProperties}>
            <Grid container spacing={2} sx={gridContainer}>
                <Grid size={2}>
                    <GlassButton
                        disabled={roomHasPassword ? false : true}
                        variant="icon-btn"
                        onClick={removePassword}
                    >
                        <DeleteIcon />
                    </GlassButton>
                </Grid>
                <Grid size={8}>
                    <GlassInput
                        kind="text input"
                        type="password"
                        value={newPassword}
                        label="Contraseña de la sala"
                        size="medium"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            e.preventDefault();
                            setNewPassword(e.target.value);
                        }}
                    />
                </Grid>
                <Grid size={2}>
                    <GlassButton
                        variant="icon-btn"
                        onClick={() => sendUpdatedPassword(newPassword)}
                    >
                        {roomHasPassword ? <KeyOffIcon /> : <KeyIcon />}
                    </GlassButton>
                </Grid>
            </Grid>
        </section>
    );
};

export default RoomPasswordUpdate;
