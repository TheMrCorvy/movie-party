import { Message, MessageWithIndex, Participant } from "..";

export enum Signals {
    "CREATE_ROOM" = "CREATE_ROOM",
    "ENTER_ROOM" = "ENTER_ROOM",
    "LEAVE_ROOM" = "LEAVE_ROOM",
    "ROOM_CREATED" = "ROOM_CREATED",
    "GET_PARTICIPANTS" = "GET_PARTICIPANTS",
    "DOES_ROOM_EXISTS" = "DOES_ROOM_EXISTS",
    "ROOM_NOT_FOUND" = "ROOM_NOT_FOUND",
    "ROOM_EXISTS" = "ROOM_EXISTS",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
    "ERROR" = "ERROR",
    "PEER_TOGGLED_CAMERA" = "PEER_TOGGLED_CAMERA",
    "NEW_PEER_JOINED" = "NEW_PEER_JOINED",
    "SCREEN_SHARING" = "SCREEN_SHARING",
}

export interface Room {
    id: string;
    messages: MessageWithIndex[];
    participants: Participant[];
    screenSharing?: MediaStream;
    peerSharingScreen: string; //id of the peer
}

export interface ServerRoom extends Room {
    password?: string;
    roomOwner: string; // The id of the participant who created the room
}

export interface CreateRoomWsParams {
    peerId: string;
    peerName: string;
    password?: string;
}

export interface RoomCreatedWsCallbackParams {
    room: Room;
    roomHasPassword: boolean;
}

export interface EnterRoomWsParams {
    roomId: string;
    peerId: string;
    peerName: string;
    password?: string;
}

export interface UpdateParticipantsWsCallback {
    roomId: string;
    participants: Participant[];
    messages: MessageWithIndex[];
    peerSharingScreen: string;
}

export interface LeaveRoomWsParams {
    roomId: string;
    peerId: string;
}

export interface RoomExistsWsParams {
    roomId: string;
}

export interface RoomExistsWsCallbackParams {
    roomExists: boolean;
    password: boolean;
}

export interface MessagesWsParams {
    roomId: string;
    message: Message;
}

export interface MessageReceivedWsCallbackParams {
    messageReceived: MessageWithIndex;
}

export interface ToggleCameraWsParams {
    roomId: string;
    peerId: string;
    cameraStatus: boolean;
}

export interface ToggleCameraWsCallbackParams {
    peerId: string;
    cameraStatus: boolean;
}

export interface ShareScreenWsParams {
    roomId: string;
    peerId: string;
    status: boolean;
}

export interface ScreenShareWsCallbackParams {
    peerId: string;
    status: boolean;
}
