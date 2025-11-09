import { useBackground, patterns } from "../../context/BackgroundImageContext";
import { sendBackgroundPattern } from "../../services/roomBackgroundService";
import { PatternClass } from "@repo/type-definitions";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import styles from "./styles";
import { CSSProperties } from "@mui/material";

export const BackgroundPatternPicker: React.FC = () => {
    const { patternClass } = useBackground();
    const { room, ws } = useRoom();
    const { patternTitle, container, patternGrid, btn } = styles();

    const setBackground = (p: PatternClass) => {
        sendBackgroundPattern({
            ws,
            roomId: room.id,
            peerId: room.myId,
            pattern: p,
        });
    };

    return (
        <div style={container as CSSProperties}>
            <label style={patternTitle as CSSProperties}>
                Patrones de fondo
            </label>
            <div style={patternGrid as CSSProperties}>
                {patterns.map((p, idx) => {
                    const key = `${String(p)}-${idx}`;
                    const selected = !!patternClass && patternClass === p;
                    return (
                        <button
                            key={key}
                            onClick={() => setBackground(p)}
                            aria-pressed={selected}
                            title={String(p)}
                            style={btn as CSSProperties}
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
