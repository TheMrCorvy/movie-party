import { Grid } from "@mui/material";
import { ChangeEvent, FC } from "react";
import GlassButton from "../GlassButton";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import GlassInput from "../GlassInput";
import styles from "./styles";
import useRoomPasswordUpdate from "./useRoomPasswordUpdate";

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
    const {
        newPassword,
        setNewPassword,
        roomHasPassword,
        removePassword,
        sendUpdatedPassword,
        handleSubmit,
    } = useRoomPasswordUpdate({
        initialPassword: password,
        roomId,
        peerId,
    });

    if (!imRoomOwner) {
        return null;
    }

    const { gridContainer } = styles();

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={gridContainer}>
                <Grid size={12}>
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
                {roomHasPassword && (
                    <Grid size={2}>
                        <GlassButton
                            aria-label="remove password"
                            variant="icon-btn"
                            onClick={removePassword}
                        >
                            <DeleteIcon />
                        </GlassButton>
                    </Grid>
                )}
                <Grid size={2}>
                    <GlassButton
                        aria-label="update password"
                        variant="icon-btn"
                        onClick={() => sendUpdatedPassword(newPassword)}
                    >
                        {roomHasPassword ? <KeyOffIcon /> : <KeyIcon />}
                    </GlassButton>
                </Grid>
            </Grid>
        </form>
    );
};

export default RoomPasswordUpdate;
