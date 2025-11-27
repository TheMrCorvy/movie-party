import GlassButton from "../GlassButton";
import GlassContainer from "../GlassContainer";
import BackgroundPatternPicker from "../BackgroundPatternPicker";
import ThemeSwitcher from "../ThemeSwitcher";
import RoomPasswordUpdate from "../RoomPasswordUpdate";
import { Box, CSSProperties, Grid } from "@mui/material";

import CreatePoll from "../CreatePoll";

import ShareIcon from "@mui/icons-material/Share";
import styles from "./styles";
import useControls from "./useControls";
import { FC } from "react";
import useClipboard from "../../hooks/useClipboard";

const RoomControls: FC = () => {
    const {
        hidden,
        patternPicker,
        btnGroup,
        passwordUpdate,
        shareRoomAndPoll,
    } = styles();

    const {
        handleButtonClick,
        handleFileChange,
        handleReset,
        room,
        fileInputRef,
    } = useControls();

    const { handleCopy } = useClipboard({ roomId: room.id });

    return (
        <GlassContainer
            width={"100%"}
            height={"90%"}
            justifyContent="space-between"
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={hidden as CSSProperties}
            />

            <Grid
                container
                spacing={{
                    xs: 0,
                    sm: 2,
                    md: 4,
                }}
                display={"flex"}
                direction="column"
                sx={{
                    height: "100%",
                }}
                justifyContent="space-around"
            >
                <Box sx={patternPicker}>
                    <BackgroundPatternPicker />
                </Box>
                <Box sx={btnGroup}>
                    <ThemeSwitcher />
                </Box>
                <Box sx={btnGroup}>
                    <GlassButton onClick={handleButtonClick}>
                        Cambiar fondo de pantalla
                    </GlassButton>
                    <GlassButton onClick={handleReset}>
                        Resetear fondo de pantalla
                    </GlassButton>
                </Box>
                {room.imRoomOwner && (
                    <Box sx={passwordUpdate}>
                        <RoomPasswordUpdate
                            imRoomOwner={room.imRoomOwner}
                            password={room.password}
                            roomId={room.id}
                            peerId={room.myId}
                        />
                    </Box>
                )}
                <Box sx={shareRoomAndPoll}>
                    <GlassButton onClick={handleCopy} startIcon={<ShareIcon />}>
                        Compartir sala
                    </GlassButton>
                    <CreatePoll />
                </Box>
            </Grid>
        </GlassContainer>
    );
};

export default RoomControls;
