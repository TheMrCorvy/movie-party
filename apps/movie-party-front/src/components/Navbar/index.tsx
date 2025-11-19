import { FC } from "react";
import GlassNavbar from "../GlassNavbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import styles from "./styles";
import useNavbarLogic from "./useNavbarLogic";
import { useGlassDrawer } from "../../context/GlassDrawerContext";
import Chat from "../Chat";
import RoomControls from "../RoomControls";
import GlassButton from "../GlassButton";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const Navbar: FC = () => {
    const { fabButtons, fabButtonsContainer, spacer, endCallStyles } = styles();
    const { toggleCamera, endCall, cameraOn } = useNavbarLogic();
    const { dispatch } = useGlassDrawer();
    const isLgDown = useMediaQuery().max.width("lg");

    return (
        <GlassNavbar
            padding={{
                paddingTop: 2,
                paddingBottom: 2,
            }}
            position={isLgDown ? "fixed" : "static"}
        >
            <>
                <IconButton
                    color="inherit"
                    aria-label="abrir ajustes"
                    onClick={() =>
                        dispatch({
                            type: "OPEN_DRAWER",
                            payload: {
                                children: (
                                    <>
                                        <RoomControls />
                                        <span
                                            style={{
                                                height: "16px",
                                            }}
                                        />
                                        <GlassButton
                                            variant="icon-btn"
                                            onClick={() =>
                                                dispatch({
                                                    type: "CLOSE_DRAWER",
                                                })
                                            }
                                        >
                                            <CloseIcon />
                                        </GlassButton>
                                    </>
                                ),
                                anchor: "left",
                            },
                        })
                    }
                >
                    <SettingsIcon />
                </IconButton>
                <Box sx={fabButtonsContainer}>
                    <Fab
                        sx={fabButtons}
                        color="primary"
                        aria-label="encender / apagar camara"
                        onClick={toggleCamera}
                    >
                        {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                    </Fab>
                    <Fab
                        sx={fabButtons}
                        color="primary"
                        aria-label="encender / apagar microfono"
                    >
                        {cameraOn ? <MicIcon /> : <MicOffIcon />}
                    </Fab>
                    <Fab
                        sx={endCallStyles}
                        color="primary"
                        aria-label="finalizar a llamada"
                        onClick={endCall}
                    >
                        <PhoneDisabledIcon />
                    </Fab>
                </Box>
                <Box sx={spacer} />
                {isLgDown && (
                    <IconButton
                        color="inherit"
                        aria-label="search"
                        onClick={() =>
                            dispatch({
                                type: "OPEN_DRAWER",
                                payload: {
                                    children: (
                                        <>
                                            <Chat />
                                            <span
                                                style={{
                                                    height: "16px",
                                                }}
                                            />
                                            <GlassButton
                                                variant="icon-btn"
                                                onClick={() =>
                                                    dispatch({
                                                        type: "CLOSE_DRAWER",
                                                    })
                                                }
                                            >
                                                <CloseIcon />
                                            </GlassButton>
                                        </>
                                    ),
                                    anchor: "right",
                                },
                            })
                        }
                    >
                        <ChatIcon />
                    </IconButton>
                )}
            </>
        </GlassNavbar>
    );
};

export default Navbar;
