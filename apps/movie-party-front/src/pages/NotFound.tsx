import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GlassButton from "../components/GlassButton";
import type { FC } from "react";
import useApplyBackground from "../hooks/useApplyBackground";
import { useTranslation } from "@salvatore.hakase/hgts/react";

const NotFound: FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                    {t("notFound.title")}
                </Typography>

                <GlassButton
                    onClick={() => navigate("/", { replace: true })}
                    fullWidth={false}
                >
                    {t("notFound.backHome")}
                </GlassButton>
            </Box>
        </Box>
    );
};

export default NotFound;
