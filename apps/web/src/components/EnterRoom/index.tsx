import type { FC } from "react";
import { useContext } from "react";

import { RoomContext } from "../../context/roomContext";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { helloWorld } from "@repo/type-definitions";

const CreateRoom: FC = () => {
	const { ws } = useContext(RoomContext);

	const createRoom = () => {
		ws.emit("create-room");
	};

	console.log(helloWorld);

	return (
		<Container
			maxWidth="xl"
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Button variant="contained" onClick={createRoom}>
				Create Room
			</Button>
		</Container>
	);
};

export default CreateRoom;
