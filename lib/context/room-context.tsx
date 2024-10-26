import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket-context";
import { SocketUser, Participant } from "../types";

interface IRoomContext {
	roomId: string;
	onlineUsers: SocketUser[];
	participantId: string;
	participants: Participant[];
}

const RoomContext = createContext<IRoomContext>({
	roomId: "",
	onlineUsers: [],
	participantId: "",
	participants: [],
});

export const RoomContextProvider = ({
	children,
	roomId,
	participantId,
	participants,
}: {
	children: React.ReactNode;
	roomId: string;
	participantId: string;
	participants: Participant[];
}) => {
	const { socket, isSocketConnected } = useSocket();
	const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

	if (!participantId) throw new Error("Participant ID is required");

	// Set online users
	useEffect(() => {
		if (!isSocketConnected || !socket) return;

		socket?.emit("add-user", participantId);
		socket.on("get-users", (users) => {
			setOnlineUsers(users);
		});

		return () => {
			socket?.off("get-users", (users) => {
				setOnlineUsers(users);
			});
		};
	}, [socket, isSocketConnected, participantId]);

	return (
		<RoomContext.Provider
			value={{ participants, roomId, onlineUsers, participantId }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoom = () => {
	const context = useContext(RoomContext);

	if (context === undefined) {
		throw new Error("useRoomContext must be used within a RoomContextProvider");
	}
	return context;
};
