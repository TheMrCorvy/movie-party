import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GlassButton from "../components/GlassButton";
import type { FC } from "react";
import useApplyBackground from "../hooks/useApplyBackground";

const NotFound: FC = () => {
    const navigate = useNavigate();

    useApplyBackground();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Box sx={{ textAlign: "center", maxWidth: 480 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                >
                    Sala no encontrada
                </Typography>

                <GlassButton
                    onClick={() => navigate("/", { replace: true })}
                    fullWidth={false}
                >
                    Volver al inicio
                </GlassButton>
            </Box>
        </Box>
    );
};

export default NotFound;
