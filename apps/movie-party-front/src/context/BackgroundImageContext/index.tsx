/* eslint-disable react-refresh/only-export-components */

import { PatternClass } from "@repo/type-definitions";
import {
    createContext,
    useReducer,
    useContext,
    ReactNode,
    Dispatch,
} from "react";

export type State = {
    background: string | null;
    patternClass?: PatternClass | null;
};

export type Action =
    | { type: "SET_BACKGROUND"; payload: string | null }
    | { type: "SET_PATTERN"; payload?: PatternClass | null };

const BackgroundStateContext = createContext<State | undefined>(undefined);
const BackgroundDispatchContext = createContext<Dispatch<Action> | undefined>(
    undefined
);

export const patterns: PatternClass[] = [
    PatternClass.CUBES,
    PatternClass.ANAMA,
    PatternClass.SQUIGLY,
    PatternClass.WAVES,
    PatternClass.STARS,
    PatternClass.CLOUDS,
    PatternClass.CLASSIC,
    PatternClass.MATERIAL,
    PatternClass.BRICKS,
];

const backgroundReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_BACKGROUND":
            return { ...state, background: action.payload, patternClass: null };
        case "SET_PATTERN":
            return {
                ...state,
                patternClass: action.payload ?? null,
                background: null,
            };
        default:
            return state;
    }
};

export const BackgroundImageProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [state, dispatch] = useReducer(backgroundReducer, {
        background: null,
        patternClass: PatternClass.CUBES,
    });

    return (
        <BackgroundStateContext.Provider value={state}>
            <BackgroundDispatchContext.Provider value={dispatch}>
                {children}
            </BackgroundDispatchContext.Provider>
        </BackgroundStateContext.Provider>
    );
};

export const useBackground = () => {
    const state = useContext(BackgroundStateContext);
    const dispatch = useContext(BackgroundDispatchContext);
    if (!state || !dispatch) {
        throw new Error(
            "useBackground must be used within a BackgroundImageProvider"
        );
    }
    return {
        background: state.background,
        patternClass: state.patternClass,
        dispatch,
    };
};
