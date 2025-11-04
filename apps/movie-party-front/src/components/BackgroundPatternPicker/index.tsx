import React from "react";
import { useBackground, patterns } from "../../context/BackgroundImageContext";

export const BackgroundPatternPicker: React.FC = () => {
    const { patternClass, dispatch } = useBackground();

    return (
        <div style={{ marginBottom: 8, textAlign: "center" }}>
            <label
                style={{
                    display: "block",
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 16,
                }}
            >
                Patrones de fondo
            </label>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                }}
            >
                {patterns.map((p, idx) => {
                    const key = `${String(p)}-${idx}`;
                    // Only mark selected when a patternClass is set (no default selection)
                    const selected = !!patternClass && patternClass === p;
                    return (
                        <button
                            key={key}
                            onClick={() =>
                                dispatch({ type: "SET_PATTERN", payload: p })
                            }
                            aria-pressed={selected}
                            title={String(p)}
                            style={{
                                padding: 0,
                                border: "none",
                                background: "transparent",
                            }}
                        >
                            <div
                                className={`pattern-preview ${p} ${selected ? "selected" : ""}`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BackgroundPatternPicker;
