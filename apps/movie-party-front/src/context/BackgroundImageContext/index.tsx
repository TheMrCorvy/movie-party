import {
    createContext,
    useReducer,
    useContext,
    ReactNode,
    Dispatch,
} from "react";
import defaultBg from "../../assets/background.jpg";

type State = string;

type Action = {
    type: "SET_BACKGROUND";
    payload: string;
};

const BackgroundStateContext = createContext<State | undefined>(undefined);
const BackgroundDispatchContext = createContext<Dispatch<Action> | undefined>(
    undefined
);

const backgroundReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_BACKGROUND":
            return action.payload;
        default:
            return state;
    }
};

export const BackgroundImageProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [state, dispatch] = useReducer(backgroundReducer, defaultBg);

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
    return { background: state, dispatch };
};
