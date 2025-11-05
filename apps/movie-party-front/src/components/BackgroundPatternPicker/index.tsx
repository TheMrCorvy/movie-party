import React from "react";
import { useBackground, patterns } from "../../context/BackgroundImageContext";
import { sendBackgroundPattern } from "../../services/roomBackgroundService";
import { PatternClass } from "@repo/type-definitions";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";

export const BackgroundPatternPicker: React.FC = () => {
    const { patternClass } = useBackground();
    const { room, ws } = useRoom();

    const setBackground = (p: PatternClass) => {
        sendBackgroundPattern({
            ws,
            roomId: room.id,
            peerId: room.myId,
            pattern: p,
        });
    };

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
                    const selected = !!patternClass && patternClass === p;
                    return (
                        <button
                            key={key}
                            onClick={() => setBackground(p)}
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
