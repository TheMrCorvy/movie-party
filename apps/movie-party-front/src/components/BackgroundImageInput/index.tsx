import React, { useRef } from "react";
import { useBackground } from "../../context/BackgroundImageContext";
import defaultBg from "../../assets/background.jpg";
import GlassButton from "../GlassButton";
import GlassContainer from "../GlassContainer";

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
        dispatch({ type: "SET_BACKGROUND", payload: defaultBg });
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
                <div style={{ marginBottom: 8 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 12,
                            marginBottom: 6,
                        }}
                    >
                        Patrones de fondo
                    </label>
                    <select
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "none") {
                                dispatch({
                                    type: "SET_PATTERN",
                                    payload: null,
                                });
                            } else {
                                dispatch({ type: "SET_PATTERN", payload: val });
                            }
                        }}
                        defaultValue={"none"}
                        style={{ padding: 6, borderRadius: 6 }}
                    >
                        <option value="none">Ninguno</option>
                        <option value="bg-pattern-one">Patrón 1</option>
                        <option value="bg-pattern-two">Patrón 2</option>
                    </select>
                </div>
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
