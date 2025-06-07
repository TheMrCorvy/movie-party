import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface EnterRoomParams {
	roomId: string;
}

export const roomHandler = (socket: Socket) => {
	const enterRoom = ({ roomId }: EnterRoomParams) => {
		socket.join(roomId);
		console.log("user asked to enter the room: ", roomId);
	};

	const createRoom = () => {
		const roomId = uuidv4();
		socket.emit("room-created", { roomId });
		console.log("user asked to create a room");
	};

	socket.on("create-room", createRoom);
	socket.on("enter-room", enterRoom);
};
