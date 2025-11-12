import GlassButton from "../GlassButton";
import GlassContainer from "../GlassContainer";
import BackgroundPatternPicker from "../BackgroundPatternPicker";
import ThemeSwitcher from "../ThemeSwitcher";
import RoomPasswordUpdate from "../RoomPasswordUpdate";
import { CSSProperties, Grid } from "@mui/material";

import CreatePoll from "../CreatePoll";

import ShareIcon from "@mui/icons-material/Share";
import styles from "./styles";
import useControls from "./useControls";
import { useGlassDrawer } from "../../context/GlassDrawerContext";
import Chat from "../Chat";

const RoomControls = () => {
    const {
        hidden,
        controlGrid,
        patternPicker,
        btnGroup,
        passwordUpdate,
        shareRoomAndPoll,
    } = styles();

    const {
        handleButtonClick,
        handleCopy,
        handleFileChange,
        handleReset,
        colSize,
        room,
        fileInputRef,
    } = useControls();

    const { dispatch } = useGlassDrawer();

    return (
        <GlassContainer width={"100%"}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={hidden as CSSProperties}
            />

            <Grid container spacing={3} sx={controlGrid}>
                <Grid size={colSize} sx={patternPicker}>
                    <BackgroundPatternPicker />
                </Grid>
                <Grid size={colSize} sx={btnGroup}>
                    <ThemeSwitcher />
                    <GlassButton onClick={handleButtonClick}>
                        Cambiar fondo de pantalla
                    </GlassButton>
                    <GlassButton onClick={handleReset}>
                        Resetear fondo de pantalla
                    </GlassButton>
                </Grid>
                {room.imRoomOwner && (
                    <Grid size={colSize} sx={passwordUpdate}>
                        <RoomPasswordUpdate
                            imRoomOwner={room.imRoomOwner}
                            password={room.password}
                            roomId={room.id}
                            peerId={room.myId}
                        />
                    </Grid>
                )}
                <Grid size={colSize} sx={shareRoomAndPoll}>
                    <GlassButton onClick={handleCopy} startIcon={<ShareIcon />}>
                        Compartir sala
                    </GlassButton>
                    <CreatePoll />
                    <GlassButton
                        onClick={() =>
                            dispatch({
                                type: "OPEN_DRAWER",
                                payload: {
                                    children: <Chat />,
                                    anchor: "right",
                                },
                            })
                        }
                    >
                        Ver mensajes
                    </GlassButton>
                </Grid>
            </Grid>
        </GlassContainer>
    );
};

export default RoomControls;
