import { useEffect, useRef } from "react";
import { useBackground } from "../context/BackgroundImageContext";

const useApplyBackground = () => {
    const { background, patternClass } = useBackground();
    const prevPatternRef = useRef<string | null>(null);

    useEffect(() => {
        document.body.style.height = "100vh";

        if (patternClass) {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundColor = "transparent";
        } else if (background) {
            document.body.style.backgroundImage = `url(${background})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        } else {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "transparent";
        }

        const prev = prevPatternRef.current;
        if (prev) {
            document.documentElement.classList.remove(prev);
        }
        if (patternClass) {
            document.documentElement.classList.add(patternClass);
        }
        prevPatternRef.current = patternClass ?? null;

        return () => {
            if (patternClass) {
                document.documentElement.classList.remove(patternClass);
            }
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "transparent";
            document.body.style.height = "";
        };
    }, [background, patternClass]);
};

export default useApplyBackground;
