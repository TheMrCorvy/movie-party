import {
    ReactNode,
    createContext,
    useContext,
    useReducer,
    Dispatch,
    useEffect,
} from "react";
import { roomReducer, RoomState } from "./roomReducer";
import type { RoomAction } from "./roomReducer";
import SocketIOClient from "socket.io-client";
import { Signals } from "@repo/type-definitions/rooms";

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

    useEffect(() => {
        ws.on(Signals.ROOM_CREATED, (params) => console.log(params));

        return () => {
            ws.off(Signals.ROOM_CREATED, (params) => console.log(params));
        };
    }, []);

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
