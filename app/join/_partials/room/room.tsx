"use client";

import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";
import { RoomSidebar } from "./room-sidebar/room-sidebar";
import { RoomChatPanel } from "./room-chat-panel";
import { RoomContentPanel } from "./room-content-panel";
import { Message } from "@/lib/types";

export const Room = () => {
  // Refs

  // States
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
          className="h-full items-stretch"
        >
          <RoomContentPanel />
          <ResizableHandle withHandle />
          <RoomChatPanel messages={messages} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
