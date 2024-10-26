"use client";

import { useRoom } from "@/lib/context/room-context";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { RoomSidebar } from "./room-sidebar";
import { Header } from "@/components/layout/header";

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

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  sender: string;
  avatar: string;
};

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
          className="h-full items-stretch"
        >
          <Room.ContentPanel />
          <ResizableHandle withHandle />
          <Room.ChatPanel messages={messages} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

Room.ContentPanel = () => {
  return (
    <ResizablePanel defaultSize={100} minSize={0}>
      <div className="p-4 h-full flex gap-4 flex-wrap justify-center items-center ">
        {Array.from({ length: 1 }).map((_, index) => (
          <div
            key={index}
            className="bg-neutral-900 min-w-[300px] min-h-[200px] flex items-center justify-center"
          >
            <span>{`Ekran ${index + 1}`}</span>
          </div>
        ))}
      </div>
    </ResizablePanel>
  );
};

Room.ChatPanel = ({ messages }: { messages: Message[] }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={30} maxSize={100}>
      <ScrollArea className="h-[calc(100%-96px)]">
        <div className="flex flex-col gap-2 p-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={message.avatar} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-center p-4 bg-muted h-24">
        <Textarea className="h-16 my-4 resize-none" />
      </div>
    </ResizablePanel>
  );
};
