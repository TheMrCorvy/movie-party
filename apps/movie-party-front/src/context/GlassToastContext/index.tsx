/* eslint-disable react-refresh/only-export-components */

import { AlertColor } from "@mui/material";
import {
    createContext,
    useReducer,
    useContext,
    ReactNode,
    Dispatch,
} from "react";

export type GlassToastState = {
    open: boolean;
    message: string | null;
    severity?: AlertColor | null;
    duration?: number | null;
    position?: Position;
};

interface Position {
    vertical: "top" | "bottom";
    horizontal: "left" | "right" | "center";
}

export type Action =
    | {
          type: "SHOW_TOAST";
          payload: {
              message: string;
              severity?: AlertColor | null;
              duration?: number;
              position?: Position;
          };
      }
    | { type: "HIDE_TOAST" };

const GlassToastStateContext = createContext<GlassToastState | undefined>(
    undefined
);
const GlassToastDispatchContext = createContext<Dispatch<Action> | undefined>(
    undefined
);

const initialState: GlassToastState = {
    open: false,
    message: null,
    severity: null,
    duration: 10000,
    position: { vertical: "top", horizontal: "center" },
};

const reducer = (state: GlassToastState, action: Action): GlassToastState => {
    switch (action.type) {
        case "SHOW_TOAST":
            return {
                ...state,
                open: true,
                message: action.payload.message,
                severity: action.payload.severity ?? null,
                duration: action.payload.duration ?? state.duration,
                position: action.payload.position ?? state.position,
            };
        case "HIDE_TOAST":
            return { ...state, open: false };
        default:
            return state;
    }
};

export const GlassToastProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <GlassToastStateContext.Provider value={state}>
            <GlassToastDispatchContext.Provider value={dispatch}>
                {children}
            </GlassToastDispatchContext.Provider>
        </GlassToastStateContext.Provider>
    );
};

export const useGlassToast = () => {
    const state = useContext(GlassToastStateContext);
    const dispatch = useContext(GlassToastDispatchContext);
    if (!state || !dispatch) {
        throw new Error(
            "useGlassToast must be used within a GlassToastProvider"
        );
    }

    return {
        open: state.open,
        message: state.message,
        severity: state.severity,
        duration: state.duration,
        position: state.position,
        dispatch,
    };
};

export default GlassToastProvider;
