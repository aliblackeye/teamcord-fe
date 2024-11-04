"use client";

import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RoomSidebar } from "./room-sidebar/room-sidebar";
import { RoomChatPanel } from "./room-chat-panel";
import { RoomContentPanel } from "./room-content-panel";
import { useChatRoom } from "@/lib/context/chat-room-context";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/lib/context/socket-context";
import { RoomUsers } from "./room-users";

export const Room = () => {
  const username = useSearchParams().get("username") || "";
  const { joinRoom } = useChatRoom();
  const { socket, isSocketConnected } = useSocket();

  useEffect(() => {
    if (!username || !socket || !isSocketConnected) return;

    joinRoom(username);
  }, [isSocketConnected, joinRoom, socket, username]);

  return (
    <div className="h-screen">
      <div className="flex h-full">
        <RoomSidebar />
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
        >
          <RoomContentPanel />
          <ResizableHandle withHandle />
          <RoomChatPanel />
        </ResizablePanelGroup>
        <RoomUsers />
      </div>
    </div>
  );
};
