"use client";

import { Suspense } from "react";
import { Room } from "./_partials/room/room";
import { ChannelContextProvider } from "@/lib/context/channel-context";
import { ChatRoomContextProvider } from "@/lib/context/chat-room-context";
import { useSearchParams } from "next/navigation";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || "Anonim";
  return (
    <Suspense fallback={<div>Joining room...</div>}>
      <ChannelContextProvider channelId={roomId}>
        <ChatRoomContextProvider>
          <Room />
        </ChatRoomContextProvider>
      </ChannelContextProvider>
    </Suspense>
  );
}
