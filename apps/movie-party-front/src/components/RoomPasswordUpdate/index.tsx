import { Grid } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import GlassButton from "../GlassButton";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import GlassInput from "../GlassInput";
import { logData } from "@repo/shared-utils/log-data";

export interface RoomPasswordUpdateProps {
    imRoomOwner: boolean;
    roomHasPassword?: boolean;
    roomId: string;
    peerId: string;
}

const RoomPasswordUpdate: FC<RoomPasswordUpdateProps> = ({
    imRoomOwner,
    roomHasPassword,
    roomId,
    peerId,
}) => {
    const [password, setpassword] = useState("");
    if (!imRoomOwner) {
        return null;
    }

    const removePassword = () => {
        setpassword("");
        sendUpdatedPassword();
    };

    const sendUpdatedPassword = () => {
        fetch("http://localhost:4000/room-password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                peerId,
                roomId,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                logData({
                    layer: "room_ws",
                    title: "Updated room password",
                    timeStamp: true,
                    data,
                    type: "info",
                });
            });
    };

    return (
        <section
            style={{
                minWidth: "25rem",
                maxWidth: "100%",
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    verticalAlign: "middle",
                }}
            >
                <Grid size={1}>
                    <GlassButton
                        disabled={!roomHasPassword}
                        variant="icon-btn"
                        onClick={removePassword}
                    >
                        <DeleteIcon />
                    </GlassButton>
                </Grid>
                <Grid size={10}>
                    <GlassInput
                        kind="text input"
                        type="password"
                        label={
                            roomHasPassword
                                ? "Cambiar contraseña de la sala"
                                : "Añadir contraseña a la sala"
                        }
                        size="medium"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            e.preventDefault();
                            setpassword(e.target.value);
                        }}
                    />
                </Grid>
                <Grid size={1}>
                    <GlassButton
                        variant="icon-btn"
                        onClick={sendUpdatedPassword}
                    >
                        {roomHasPassword ? <KeyOffIcon /> : <KeyIcon />}
                    </GlassButton>
                </Grid>
            </Grid>
        </section>
    );
};

export default RoomPasswordUpdate;
