import {
    ReactNode,
    createContext,
    useContext,
    useReducer,
    Dispatch,
} from "react";
import { roomReducer, RoomState } from "./roomReducer";
import type { RoomAction } from "./roomActions";
import SocketIOClient from "socket.io-client";

const WS = "http://localhost:4000";
const ws = SocketIOClient(WS);

const RoomContext = createContext<RoomState | undefined>(undefined);
const RoomDispatchContext = createContext<Dispatch<RoomAction> | undefined>(
    undefined
);

const initialState: RoomState = {
    room: {
        id: "",
        messages: [],
        participants: [],
        myId: "",
    },
    ws,
};

export const RoomContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(roomReducer, initialState);

    return (
        <RoomContext.Provider value={state}>
            <RoomDispatchContext.Provider value={dispatch}>
                {children}
            </RoomDispatchContext.Provider>
        </RoomContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom = () => {
    const context = useContext(RoomContext);
    const dispatch = useContext(RoomDispatchContext);
    if (!context || !dispatch) {
        throw new Error("useRoom must be used within a RoomContextProvider");
    }
    return {
        room: context.room,
        dispatch,
        ws: context.ws,
    };
};
