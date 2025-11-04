import {
    createContext,
    useReducer,
    useContext,
    ReactNode,
    Dispatch,
} from "react";
import defaultBg from "../../assets/background.jpg";

type State = {
    background: string | null;
    patternClass?: string | null;
};

type Action =
    | { type: "SET_BACKGROUND"; payload: string }
    | { type: "SET_PATTERN"; payload?: string | null };

const BackgroundStateContext = createContext<State | undefined>(undefined);
const BackgroundDispatchContext = createContext<Dispatch<Action> | undefined>(
    undefined
);

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
        background: defaultBg,
        patternClass: null,
    });

    return (
        <BackgroundStateContext.Provider value={state}>
            <BackgroundDispatchContext.Provider value={dispatch}>
                {children}
            </BackgroundDispatchContext.Provider>
        </BackgroundStateContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
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
