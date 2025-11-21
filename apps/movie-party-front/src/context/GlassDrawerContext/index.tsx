/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useReducer,
    useContext,
    ReactNode,
    Dispatch,
} from "react";

export type GlassDrawerAnchor = "left" | "right" | "top" | "bottom";

export type GlassDrawerState = {
    open: boolean;
    anchor: GlassDrawerAnchor;
    children: ReactNode | null;
};

export type Action =
    | {
          type: "OPEN_DRAWER";
          payload: { anchor?: GlassDrawerAnchor; children?: ReactNode };
      }
    | { type: "CLOSE_DRAWER" };

const GlassDrawerStateContext = createContext<GlassDrawerState | undefined>(
    undefined
);
const GlassDrawerDispatchContext = createContext<Dispatch<Action> | undefined>(
    undefined
);

const initialState: GlassDrawerState = {
    open: false,
    anchor: "right",
    children: null,
};

const reducer = (state: GlassDrawerState, action: Action): GlassDrawerState => {
    switch (action.type) {
        case "OPEN_DRAWER":
            return {
                open: true,
                anchor: action.payload?.anchor ?? state.anchor,
                children: action.payload?.children ?? null,
            };
        case "CLOSE_DRAWER":
            return { ...state, open: false, children: null };
        default:
            return state;
    }
};

export const GlassDrawerProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <GlassDrawerStateContext.Provider value={state}>
            <GlassDrawerDispatchContext.Provider value={dispatch}>
                {children}
            </GlassDrawerDispatchContext.Provider>
        </GlassDrawerStateContext.Provider>
    );
};

export const useGlassDrawer = () => {
    const state = useContext(GlassDrawerStateContext);
    const dispatch = useContext(GlassDrawerDispatchContext);

    if (!state || !dispatch) {
        throw new Error(
            "useGlassDrawer must be used within a GlassDrawerProvider"
        );
    }

    return {
        open: state.open,
        anchor: state.anchor,
        children: state.children,
        dispatch,
    };
};

export default GlassDrawerProvider;
