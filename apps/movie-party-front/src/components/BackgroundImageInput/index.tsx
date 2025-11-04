import React, { useRef } from "react";
import {
    useBackground,
    PatternClass,
} from "../../context/BackgroundImageContext";
import GlassButton from "../GlassButton";
import GlassContainer from "../GlassContainer";
import BackgroundPatternPicker from "../BackgroundPatternPicker";

export const BackgroundImageInput = () => {
    const { dispatch } = useBackground();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    dispatch({
                        type: "SET_BACKGROUND",
                        payload: e.target.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        // Clear custom image and set default pattern (cubes)
        dispatch({ type: "SET_BACKGROUND", payload: null });
        dispatch({ type: "SET_PATTERN", payload: PatternClass.CUBES });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                left: 20,
                zIndex: 1000,
            }}
        >
            <GlassContainer>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
                <BackgroundPatternPicker />
                <GlassButton onClick={handleButtonClick}>
                    Cambiar fondo de pantalla
                </GlassButton>
                <GlassButton onClick={handleReset}>
                    Resetear fondo de pantalla
                </GlassButton>
            </GlassContainer>
        </div>
    );
};
