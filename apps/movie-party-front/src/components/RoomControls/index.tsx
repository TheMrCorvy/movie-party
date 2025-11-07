import React, { useRef } from "react";
import { PatternClass } from "@repo/type-definitions";
import GlassButton from "../GlassButton";
import GlassContainer from "../GlassContainer";
import BackgroundPatternPicker from "../BackgroundPatternPicker";
import ThemeSwitcher from "../ThemeSwitcher";
import RoomPasswordUpdate from "../RoomPasswordUpdate";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { Grid } from "@mui/material";

import CreatePoll from "../CreatePoll";
import { copyToClipboard } from "../../utils/accessUserHardware";
import { logData } from "@repo/shared-utils/log-data";
import {
    sendBackgroundPattern,
    uploadRoomBackground,
} from "../../services/roomBackgroundService";
import ShareIcon from "@mui/icons-material/Share";

const RoomControls = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { room, ws } = useRoom();

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await uploadRoomBackground({
                    file,
                    roomId: room.id,
                    peerId: room.myId,
                });
            } catch (error) {
                logData({
                    type: "error",
                    data: error,
                    timeStamp: true,
                    layer: "access_user_hardware",
                });
            }
        }
    };

    const handleReset = () => {
        sendBackgroundPattern({
            ws,
            roomId: room.id,
            peerId: room.myId,
            pattern: PatternClass.CUBES,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleCopy = async () => {
        const text = "http://localhost:5173/join-room/" + room.id;
        await copyToClipboard({
            callback: (params) =>
                logData({
                    title: "Copied invitation",
                    data: params,
                    type: "info",
                    timeStamp: true,
                    layer: "access_user_hardware",
                }),
            text,
        });
    };

    return (
        <GlassContainer width={"100%"}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
            />

            <Grid
                container
                spacing={3}
                sx={{
                    justifyContent: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                <Grid
                    size={{
                        md: 6,
                        lg: 4,
                        xl: 3,
                    }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <BackgroundPatternPicker />
                </Grid>
                <Grid
                    size={{
                        md: 6,
                        lg: 4,
                        xl: 3,
                    }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <ThemeSwitcher />
                    <GlassButton onClick={handleButtonClick}>
                        Cambiar fondo de pantalla
                    </GlassButton>
                    <GlassButton onClick={handleReset}>
                        Resetear fondo de pantalla
                    </GlassButton>
                </Grid>
                {room.imRoomOwner && (
                    <Grid
                        size={{
                            md: 6,
                            lg: 4,
                            xl: 3,
                        }}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <RoomPasswordUpdate
                            imRoomOwner={room.imRoomOwner}
                            password={room.password}
                            roomId={room.id}
                            peerId={room.myId}
                        />
                    </Grid>
                )}
                <Grid
                    size={{
                        md: 6,
                        lg: 4,
                        xl: 3,
                    }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            md: "column",
                            lg: "row",
                            xl: "column",
                        },
                    }}
                >
                    <GlassButton onClick={handleCopy} startIcon={<ShareIcon />}>
                        Compartir sala
                    </GlassButton>
                    <CreatePoll />
                </Grid>
            </Grid>
        </GlassContainer>
    );
};

export default RoomControls;
