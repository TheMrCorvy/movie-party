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
    peer: null,
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

/**
 * 
 * ./apps/movie-party-backend. To stream video to other participants, the app implements Peerjs. The peerjs server is located in ./apps/peerjs-server. The current process to stream a user's camera is as follows: User clicks        │
│   on the camera icon button in the component PeerVideo -> the function toggleCamera dispatches an event so that the global state can access the user's camera -> the same function emits a signal to the websocket server to          │
│   let other people know when they started or stopped sharing their camera -> then the useEffect will update and start a call to everyone else in the room -> the ws backend receives the signal and answers with the same             │
│   signal -> Room.tsx page listens to the websocket signal and if the user turned off their camera, dispatches this to the global state to finish the stream of that participant -> the Room page listens to the call of other         │
│   participants on a sepparate useEffect -> the room page reacts when it receives an incoming call -> listenPeerEventsService will react to the "call" event -> answerCall will answer the call with a strem if there is any ->        │
│   the callback will dispatch the toggled camera action to set that incoming call as that peer's stream -> when any user turns off their camera the process repeats but closing that stream and removing it from the global            │
│   state. Right now there is a problem where if a new user joins the room, they won't see the other people's cameras if they are turned on. This happens because the JoinRoom page and the layout component aren't listening to        │
│   the peers, and so the room.participants array that the new user will see is comming from the websocket backend (with a stream property being empty). I tried adding a startCall iteration on the Room.tsx page so that on           │
│   every change on room.participants it would call everyone again, but it ended up on an infinite loop calling everyone, setting up the state, and calling everyone again. I also tried setting up an orther on the participants       │
│   so that I'd know who to call specifically, but that only works when someone enters the room, not when they leave.  
 */

export interface UseRoomState extends RoomState {
    dispatch: Dispatch<RoomAction>;
}

export type UseRoom = () => UseRoomState;

// eslint-disable-next-line react-refresh/only-export-components
export const useRoom: UseRoom = () => {
    const context = useContext(RoomContext);
    const dispatch = useContext(RoomDispatchContext);
    if (!context || !dispatch) {
        throw new Error("useRoom must be used within a RoomContextProvider");
    }
    return {
        room: context.room,
        dispatch,
        ws: context.ws,
        peer: context.peer,
    };
};
