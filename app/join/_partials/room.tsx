"use client";

import { useRoom } from "@/lib/context/room-context";

import {
	ResizableHandle,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCallback, useState } from "react";
import { RoomSidebar } from "./room-sidebar";
import { RoomChatPanel } from "./room-chat-panel";
import { RoomContentPanel } from "./room-content-panel";
import { Message } from "@/lib/types";

const iceServers = [
	{
		urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
	},
	/* {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:a.relay.metered.ca:80",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:443",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:443?transport=tcp",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:80?transport=tcp",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  }, */
];

export const Room = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { onlineUsers } = useRoom();
	const [ongoingCall, setOngoingCall] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content: "Merhaba",
			createdAt: new Date(),
			sender: "Anonim",
			avatar: "",
		},
	]);

	return (
		<div className="h-screen">
			<div className="flex h-full">
				<RoomSidebar />
				<ResizablePanelGroup
					direction="horizontal"
					className="h-full items-stretch">
					<RoomContentPanel />
					<ResizableHandle withHandle />
					<RoomChatPanel messages={messages} />
				</ResizablePanelGroup>
			</div>
		</div>
	);
};
